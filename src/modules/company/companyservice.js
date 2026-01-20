
import { CompanyModel } from "../../DB/model/CompanyModel.js";

export const createCompany = async (userId, data) => {
    // Basic creation logic. 
    // Validation is assumed to be handled before or by Mongoose schema.
    const company = await CompanyModel.create({
        ...data,
        createdBy: userId
    });
    return company;
};

export const getCompanyById = async (companyId) => {
    const company = await CompanyModel.findById(companyId);
    return company;
};
