import Company from '../models/Company.model.js';
import { POPULAR_COMPANIES } from './constants.js';

// Get all companies
export const getAllCompanies = async () => {
  try {
    const companies = await Company.find().sort('name');
    return companies;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

// Add a new company
export const addCompany = async (companyName) => {
  try {
    // Check if company already exists
    const existingCompany = await Company.findOne({ name: { $regex: new RegExp(`^${companyName}$`, 'i') } });
    
    if (existingCompany) {
      return existingCompany;
    }
    
    // Create new company
    const newCompany = new Company({
      name: companyName,
      isPopular: POPULAR_COMPANIES.includes(companyName)
    });
    
    await newCompany.save();
    return newCompany;
  } catch (error) {
    console.error('Error adding company:', error);
    throw error;
  }
};