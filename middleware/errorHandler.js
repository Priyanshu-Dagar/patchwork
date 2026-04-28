module.exports = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).render('error', { 
      title: 'Validation Error', 
      message: err.message 
    });
  }

  res.status(500).render('error', { 
    title: 'Server Error', 
    message: 'Internal server error' 
  });
};
