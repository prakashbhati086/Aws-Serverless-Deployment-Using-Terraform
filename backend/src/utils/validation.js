const validateUser = (userData) => {
    const errors = [];
    
    if (!userData.name || userData.name.trim().length === 0) {
        errors.push('Name is required');
    }
    
    if (!userData.email || !isValidEmail(userData.email)) {
        errors.push('Valid email is required');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

module.exports = {
    validateUser,
    isValidEmail
};
