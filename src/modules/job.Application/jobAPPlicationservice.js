
import { JobApplicationModel } from "../../DB/model/JobApplication.js";
import { JobModel } from "../../DB/model/Jop.Model.js";
import { sendEmail } from "../../utils/email/sendEmail.js";

const getEmailTemplate = (name, jobTitle, isAccepted) => {
  const primaryColor = isAccepted ? "#10b981" : "#ef233c";
  const statusIcon = isAccepted ? "✅" : "❌";
  const headerText = isAccepted ? "Application Accepted" : "Application Update";
  const headerTextAr = isAccepted ? "تم قبول طلبك" : "تحديث بخصوص طلبك";

  const mainMessageEn = isAccepted
    ? `Congratulations! You have been <strong>accepted</strong> for the <strong>${jobTitle}</strong> position.`
    : `Thank you for your interest in the <strong>${jobTitle}</strong> position. After careful consideration, we have decided to move forward with other candidates at this time.`;

  const mainMessageAr = isAccepted
    ? `تهانينا! يسعدنا إبلاغك بأنه تم <strong>قبولك</strong> في وظيفة <strong>${jobTitle}</strong>.`
    : `نشكرك على اهتمامك بوظيفة <strong>${jobTitle}</strong>. نأسف لإبلاغك بأنه تم اختيار مرشحين آخرين هذه المرة، ونتمنى لك التوفيق.`;

  const footerEn = isAccepted ? "Our team will contact you shortly with the next steps." : "We wish you the best of luck in your career search.";
  const footerAr = isAccepted ? "سيتواصل معك فريقنا قريباً لتحديد الخطوات القادمة." : "نتمنى لك كل التوفيق في مسيرتك المهنية.";

  // Final filtered name
  const safeName = name && name !== 'undefined' && name !== 'undefined undefined' ? name : 'Candidate';

  return `
    <div dir="auto" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 30px; text-align: center; color: white;">
            <div style="font-size: 40px; margin-bottom: 10px;">${statusIcon}</div>
            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">StartUp <span style="color: #10b981;">AI</span></h1>
            <p style="margin: 10px 0 0; opacity: 0.8; font-size: 14px;">${headerText} | ${headerTextAr}</p>
        </div>
        
        <div style="padding: 40px 30px; line-height: 1.8; color: #334155;">
            <h2 style="margin-top: 0; color: #0f172a; font-size: 20px;">Hi ${safeName},</h2>
            
            <p style="font-size: 16px;">${mainMessageEn}</p>
            <p style="font-size: 16px; direction: rtl; text-align: right;">${mainMessageAr}</p>
            
            <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 12px; border-left: 4px solid ${primaryColor};">
                <p style="margin: 0; font-weight: 600; color: #475569;">Job Role: <span style="color: #0f172a;">${jobTitle}</span></p>
            </div>
            
            <p style="font-size: 15px; color: #64748b;">${footerEn}</p>
            <p style="font-size: 15px; color: #64748b; direction: rtl; text-align: right;">${footerAr}</p>
            
            <div style="margin-top: 30px; text-align: center;">
                <a href="#" style="background-color: ${primaryColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">View Application Status</a>
            </div>
        </div>
        
        <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8;">
            <p style="margin: 0;">&copy; 2026 StartUp AI - Empowering Future Founders</p>
            <p style="margin: 5px 0 0;">MIS King College Project</p>
        </div>
    </div>
  `;
};

export const applyJobController = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    // Check if job exists
    const job = await JobModel.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const application = await JobApplicationModel.create({
      job: jobId,
      user: userId,
      ...req.body, // cv - coverLetter
    });

    return res.status(201).json({
      message: "Applied successfully",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};


export const reviewApplicationController = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { decision } = req.body; // accepted | rejected

    if (!["accepted", "rejected"].includes(decision)) {
      return res.status(400).json({ message: "Invalid decision" });
    }

    const application = await JobApplicationModel
      .findById(applicationId)
      .populate("user", "email firstName lastName")
      .populate("job", "title");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = decision;
    await application.save();

    // 📧 Email content
    const emailSubject = decision === "accepted" ? "🎉 Application Accepted" : "❌ Regarding your Application";

    const candidateName = (application.user.firstName && application.user.firstName !== 'undefined')
      ? `${application.user.firstName} ${application.user.lastName !== 'undefined' ? application.user.lastName : ''}`.trim()
      : (application.user.username && application.user.username !== 'undefined' && application.user.username !== 'undefined undefined' ? application.user.username : 'Candidate');

    await sendEmail({
      to: application.user.email,
      subject: emailSubject,
      html: getEmailTemplate(candidateName, application.job.title, decision === "accepted"),
    });

    return res.json({
      message: `Application ${decision} successfully`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};


export const getJobApplications = async (jobId) => {
  const applications = await JobApplicationModel
    .find({ job: jobId })
    .populate("user", "firstName lastName email phone skills")
    .sort({ createdAt: -1 });

  return applications;
};

export const getApplicantsController = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    console.log('Fetching applicants for jobId:', jobId);
    const applications = await getJobApplications(jobId);
    console.log('Found applicants count:', applications.length);
    return res.status(200).json({ message: "Applications fetched successfully", data: applications });
  } catch (error) {
    console.error('Error in getApplicantsController:', error);
    next(error);
  }
};
