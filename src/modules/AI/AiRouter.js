import { Router } from "express";
import { authentication } from "../../middleware/authecation.middleware.js";
import { authorization } from "../../middleware/authorization.js";
import { ROLES } from "../../utils/roles.js";
import { analyzeCompanyWithAI } from "../../modules/AI/AIService.js";
import * as companyService from "../../modules/company/companyservice.js";

const router = Router();

/**
 * @route POST /ai/company/:companyId
 * @desc  Generate AI report for a company
 * @access COMPANYOWNER, HR
 */

router.post(
  "/company/:companyId",
  authentication,
  authorization([ROLES.COMPANYOWNER, ROLES.HR]),
  async (req, res) => {
    try {
      const { companyId } = req.params;
      console.log('AI Route started for company:', companyId);
      // 1️⃣ تحقق من وجود الشركة
      const company = await companyService.getCompanyById(companyId);
      if (!company) {
        console.log('Company not found:', companyId);
        return res.status(404).json({ message: "Company not found" });
      }

      console.log('Company found:', company.name);

      // 2️⃣ تحقق من صلاحية المستخدم (المالك أو HR في الشركة)
      if (!company.createdBy.equals(req.user._id) && req.user.role !== ROLES.HR) {
        console.log('User not authorized:', req.user._id);
        return res.status(403).json({ message: "Not authorized for this company" });
      }

      console.log('User authorized, calling AI...');

      // 3️⃣ استدعاء AI
      const aiResult = await analyzeCompanyWithAI({
        companyName: company.name,
        industry: company.industry,
        description: company.description,
        initialCapital: company.initialCapital
      });

      console.log('AI Result success:', aiResult.success);

      if (!aiResult.success) {
        console.log('AI Call failed:', aiResult.error);
        return res.status(aiResult.errorType === 'rate_limit' ? 429 : 503).json({
          message: aiResult.userMessage || "AI Service Unavailable",
          error: aiResult.error
        });
      }

      // 4️⃣ تخزين النتيجة في الشركة (اختياري)
      console.log('Saving AI report to database...');
      company.aiReport = aiResult.rawAnalysis;
      await company.save();
      console.log('Company updated successfully');

      // 5️⃣ الرد على العميل
      res.status(200).json({
        message: "AI analysis generated successfully",
        aiReport: aiResult.rawAnalysis
      });
    } catch (error) {
      console.error('Error in AI Route:', error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

export default router;
