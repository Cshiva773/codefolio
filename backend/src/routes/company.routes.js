import express from 'express';
import { getAllCompanies, addCompany } from '../utils/companyService.js';
import { INDUSTRIES } from '../utils/constants.js';
import Company from '../models/Company.model.js';
import { verifyJWT, isAdmin } from '../middlewares/auth.middleware.js';
const router = express.Router();

// Get all companies
router.get('/companies', async (req, res) => {
  try {
    const companies = await getAllCompanies();
    res.status(200).json({
      success: true,
      data: companies
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// Add a new company
router.post('/companies', verifyJWT, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Company name is required'
      });
    }
    
    const company = await addCompany(name.trim());
    
    res.status(201).json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Error adding company:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// Get all industries
router.get('/industries', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: INDUSTRIES
    });
  } catch (error) {
    console.error('Error fetching industries:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// Admin endpoint to update company details
router.put('/companies/:id', verifyJWT, isAdmin, async (req, res) => {
  try {
    const { name, logo, isPopular } = req.body;
    
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    company.name = name || company.name;
    company.logo = logo || company.logo;
    company.isPopular = isPopular !== undefined ? isPopular : company.isPopular;
    
    await company.save();
    
    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

export default router;