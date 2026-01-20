import JobModel from "../../DB/model/Jop.Model.js";
import CompanyModel from "../../DB/model/CompanyModel.js";


export const createJobService = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const userId = req.user._id;

    // 1️⃣ تأكد إن الشركة موجودة
    const company = await CompanyModel.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // 2️⃣ تأكد إن اليوزر هو Owner أو HR في الشركة
    const isOwner = company.createdBy.toString() === userId.toString();
    const isHR = company.HRs?.some(
      (hrId) => hrId.toString() === userId.toString()
    );

    if (!isOwner && !isHR) {
      return res.status(403).json({ message: "You are not allowed to create job for this company" });
    }

    // 3️⃣ إنشاء الوظيفة
    const job = await JobModel.create({
      ...req.body,
      company: companyId,
      createdBy: userId
    });

    return res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
