const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.HUBSPOT_API_KEY;

// 🏠 ROUTE 1 - Homepage: عرض كل الكستم أوبجكتات
app.get('/', async (req, res) => {
  const url = 
    'https://api.hubapi.com/crm/v3/objects/2-194143844?properties=name&properties=type&properties=age';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.get(url, { headers });
    const data = response.data.results.map(obj => ({
      id: obj.id,
      name: obj.properties.name,
      type: obj.properties.type,
      age: obj.properties.age
    }));

    res.render('homepage', { title: 'My Custom Objects | HubSpot Practicum', data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Error fetching data');
  }
});

// 📝 ROUTE 2 - صفحة الفورم لإضافة أو تحديث كستم أوبجكت
app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form | HubSpot Practicum' });
});

// 🚀 ROUTE 3 - POST لإنشاء كستم أوبجكت جديد
app.post('/update-cobj', async (req, res) => {
  const url = 'https://api.hubapi.com/crm/v3/objects/2-194143844';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  const newObj = {
    properties: {
      name: req.body.name,
      type: req.body.type,
      age: req.body.age
    }
  };

  try {
    await axios.post(url, newObj, { headers });
    res.redirect('/');
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Error adding new record');
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/



