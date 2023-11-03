const express = require('express');
const customHelpers = require('./hepler');
const path = require('path');
const app = express();
const exphbs = require('express-handlebars');
const port = process.env.PORT || 3000;



app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

// Load and parse the JSON data from the "SuperSales.json" file (make sure the filename matches)
const supersalesData = require('./SuperSales.json');

app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

// Add the "/about" route
app.get('/about', function(req, res) {
  res.render('resume', { title: 'My Resume' });
});

// Add the "/data" route
app.get('/data', function(req, res) {
  // Log the JSON data in the console
  console.log(supersalesData);
  res.send('JSON data is loaded and ready!');
});

// Add the dynamic route to handle Invoice ID by index
app.get('/data/invoiceNo/:index', function(req, res) {
  const index = req.params.index;
  
  if (!isNaN(index) && index >= 0 && index < supersalesData.length) {
    const invoiceID = supersalesData[index]['Invoice ID'];
    res.render('invoiceNo', { invoiceID });
  } else {
    res.render('error', { title: 'Error', message: 'Invalid index value' });
  }
});

//search Operation
app.get('/data/invoiceNo/:index', function(req, res) {
    const index = req.params.index;
    
    if (!isNaN(index) && index >= 0 && index < supersalesData.length) {
      const invoiceID = supersalesData[index]['Invoice ID'];
      res.render('invoiceNo', { invoiceID });
    } else {
      res.render('error', { title: 'Error', message: 'Invalid index value' });
    }
  });
  
  app.get('/search/invoiceNo', function(req, res) {
    res.render('searchInvoiceNo', { title: 'Search Invoice Number' });
  });
  
  // Handle the search form submission
  app.post('/search/invoiceNo', function(req, res) {
    const searchInvoiceNo = req.body.invoiceNo; // Access form data using req.body
    const matchingSales = supersalesData.filter(item => item['Invoice ID'] === searchInvoiceNo);
  
    if (matchingSales.length > 0) {
      res.render('searchResults', { sales: matchingSales });
    } else {
      res.render('error', { title: 'Error', message: 'Invoice Number not found' });
    }
  });  

  
  //productline 
app.get('/search/produceLine', function(req, res) {
    res.render('searchForm', { title: 'Search by Product Line' });
});

// Handle the search form submission
app.post('/search/produceLine', function(req, res) {
    const searchProductLine = req.body.productLine;
    const matchingProducts = supersalesData.filter(item => item['Product line'] === searchProductLine);

    if (matchingProducts.length > 0) {
        // Extract the required information (Invoice ID, Branch, City, Customer Type, Name, Rating)
        const selectedData = matchingProducts.map(item => ({
            'Invoice ID': item['Invoice ID'],
            'Branch': item['Branch'],
            'City': item['City'],
            'Customer type': item['Customer type'],
            'name': item['name'],
            'Rating': item['Rating'],
        }));
        res.render('results', { products: selectedData });
    } else {
        res.render('error', { title: 'Error', message: 'No matching products found' });
    }
});

//All data in table form
app.get('/viewData', function (req, res) {
    // Retrieve the sales data here
    // You should have the sales data loaded in your app
    // Replace 'salesData' with your actual variable name
    const salesData = require('./SuperSales.json'); // Load your data
  
    res.render('viewData', { sales: salesData });
  });

//step8
app.get('/filterViewData', (req, res) => {
    const filterViewData = supersalesData;   
    res.render('viewdatacon', { sales: filterViewData  });
  });

  //step9
  app.get('/updateViewData', (req, res) => {
    const salesDataInfo = supersalesData;   
  const updateViewData = salesDataInfo.map((data) => {
      if (data.Rating === 0) {
          data.Rating = 'zero';
      }
      return data;
  }); 
  res.render('updateviewdata', { supersalesData: updateViewData });
  });

 
app.get('/users', function(req, res) {
  res.send('respond with a resource');
});

app.get('*', function(req, res) {
  res.render('error', { title: 'Error', message: 'Wrong Route' });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
