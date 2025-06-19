const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
// Middleware CORS
const corsOptions = {
  origin: 'http://localhost:4200', // ou '*' pour autoriser toutes les origines
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // autoriser les cookies et les en-têtes d'autorisation
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cors());

let cart = [];
let products =[];
app.get("/api/products", (req, res) => {
   products = [
    {
      productID: 1,
      productTitle: "Tablette SAM 12 Pouce",
      productImage: "assets/tablette.jpg",
      productPrice:2334,
      quantity:10,
      category:"tablette",
      details:"Une tablette puissante avec un écran de 12 pouces. Idéale pour le travail ou le divertissement."
    },
    {
      productID: 2,
      productTitle: "Ordinateur Portable XYZ",
      productImage: "assets/ordinateur.png",
      productPrice:3999,
      quantity:8,
      category:"tablette",
      details:"Un ordinateur portable performant avec des spécifications avancées. Parfait pour les tâches professionnelles et le jeu."
    
    },
    {
      productID: 3,
      productTitle: "Smartphone ABC",
      productImage: "assets/IPhone_14.jpg",
      productPrice:1299,
      quantity:15,
      category:"phone",
      details:"Un smartphone élégant et abordable avec des fonctionnalités avancées. Capturez vos moments spéciaux avec sa caméra haute résolution."
   
    },
  
    {
      productID: 4,
      productTitle: "Smartphone XYZ (épuisé)",
      productImage: "assets/images/phone2.png",
      category: "tablet",
      productPrice:5000,
      quantity:0,
      category:"phone",
      details:"Un smartphone haut de gamme offrant des performances exceptionnelles. Actuellement en rupture de stock, mais vérifiez régulièrement les mises à jour.",
    },
    {
      productID: 5,
      productTitle: "Smartphone XYZ",
      productImage: "assets/images/tablette2.png",
      productPrice:3000,
      quantity:3,
      category:"tablette",
      details:"Un smartphone polyvalent avec un design élégant. Profitez d\'une expérience utilisateur fluide et d\'une superbe qualité d\'image."
   
    },
    {
      productID: 6,
      productTitle: "Casque JBL Bluetooth",
      productImage: "assets/images/banner/banner-2-bg.jpg",
      productPrice:800,
      quantity:11,
      category:"casque",
      details:"Découvrez une expérience audio exceptionnelle avec le Casque JBL Bluetooth. Grâce à sa technologie Bluetooth avancée, ce casque offre une connectivité sans fil transparente avec vos appareils préférés, tels que smartphones, tablettes et ordinateurs, garantissant une liberté de mouvement totale. Plongez-vous dans un monde de sonorité immersive grâce à la renommée de la qualité audio JBL, qui offre une restitution claire et équilibrée avec des basses percutantes et des aigus nets"


    },
    {
      productID: 7,
      productTitle: "Smartphone XYZ",
      productImage: "assets/images/product-details/01.jpg",
      productPrice:20000,
      quantity:14,
      category:"smartphone",
      details:"Un smartphone polyvalent avec un design élégant. Profitez d\'une expérience utilisateur fluide et d\'une superbe qualité d\'image."

    },
    {
      productID: 8,
      productTitle: "Smartphone XYZ",
      productImage: "assets/images/product-details/02.jpg",
      productPrice:3000,
      quantity:14,
      category:"smartphone",
      details:"Un smartphone polyvalent avec un design élégant. Profitez d\'une expérience utilisateur fluide et d\'une superbe qualité d\'image."
    },
    {
      productID: 9,
      productTitle: "TV sumsung",
      productImage: "assets/images/TV1.png",
      productPrice:7000,
      quantity:10,
      category:"TV",
      details:"Un smartphone tv avec un design élégant. Profitez d\'une expérience utilisateur fluide et d\'une superbe qualité d\'image."
    },
    {
      productID: 10,
      productTitle: "TV LG",
      productImage: "assets/images/TV2.png",
      productPrice:5000,
      quantity:6,
      category:"TV",
      details:"Un tv polyvalent avec un design élégant. Profitez d\'une expérience utilisateur fluide et d\'une superbe qualité d\'image."
    },
    {
      productID: 11,
      productTitle: "camera degital",
      productImage: "assets/images/camera_degital/cam1.jpeg",
      productPrice:6000,
      quantity:30,
      category:"camera_degital",
      details:"Une camera_degital puissante avec un écran de 12 pouces. Idéale pour le travail ou le divertissement."
    },
    {
      productID: 12,
      productTitle: "camera degital X124",
      productImage: "assets/images/camera_degital/cam2.jpeg",
      productPrice:1000,
      quantity:10,
      category:"camera_degital",
      details:"Une camera_degital puissante avec un écran de 12 pouces. Idéale pour le travail ou le divertissement."
    },
    {
      productID: 13,
      productTitle: "camera degital V34XY",
      productImage: "assets/images/camera_degital/cam3.jpeg",
      productPrice:999,
      quantity:10,
      category:"camera_degital",
      details:"Une camera_degital puissante avec un écran de 12 pouces. Idéale pour le travail ou le divertissement."
    },
    {
      productID: 14,
      productTitle: "camera degital 565BY",
      productImage: "assets/images/camera_degital/cam4.jpeg",
      productPrice:789,
      quantity:17,
      category:"camera_degital",
      details:"Une camera_degital puissante avec un écran de 12 pouces. Idéale pour le travail ou le divertissement."
    },
    {
      productID: 15,
      productTitle: "camera degital EEE3XL",
      productImage: "assets/images/camera_degital/cam6.jpeg",
      productPrice:2099,
      quantity:20,
      category:"camera_degital",
      details:"Une camera_degital puissante avec un écran de 12 pouces. Idéale pour le travail ou le divertissement."
    },
    {
      productID: 16,
      productTitle: "Drone WXQE",
      productImage: "assets/images/drone/drone1.jpg",
      productPrice:10099,
      quantity:20,
      category:"drone",
      details:"Une drone puissante avec un écran de 12 pouces. Idéale pour le travail ou le divertissement."
    },
    {
      productID: 17,
      productTitle: "Drone FS123",
      productImage: "assets/images/drone/drone2.jpeg",
      productPrice:20099,
      quantity:20,
      category:"drone",
      details:"Une drone puissante avec un écran de 12 pouces. Idéale pour le travail ou le divertissement."
    },
    {
      productID: 18,
      productTitle: "Drone FS123",
      productImage: "assets/images/drone/drone3.jpeg",
      productPrice:20099,
      quantity:20,
      category:"drone",
      details:"Une drone puissante avec un écran de 12 pouces. Idéale pour le travail ou le divertissement."
    },

    {
      productID: 19,
      productTitle: "Drone X139",
      productImage: "assets/images/drone/drone4.jpeg",
      productPrice:20099,
      quantity:20,
      category:"drone",
      details:"Une drone puissante avec un écran de 12 pouces. Idéale pour le travail ou le divertissement."
    },
  ];
  res.send(products);
});



app.post("/api/cart", (req, res) => {
  cart = req.body;
  setTimeout(() => res.status(201).send(), 20);
});

app.get("/api/cart", (req, res) => res.send(cart));


const users = {
  "houri.aymane03@gmail.com": {
    userId: 1,
    firstName: "aymane",
    lastName: "houri",
    email: "houri.aymane03@gmail.com",
    password: "test",
  }
};
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = users[email];

  if (user && user.password === password) {
    res.status(200).send({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } else {
    res.status(401).send("Invalid email or password.");
  }
});


app.get("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  // Recherchez le produit dans la liste des produits en fonction de l'ID
  const product = products.find(product => product.productID === parseInt(productId));
  
  if (product) {
    res.send(product); // Retournez le produit trouvé
  } else {
    res.status(404).send("Product not found"); // Retournez une erreur 404 si le produit n'est pas trouvé
  }
});


const port = 3000;

app.listen(port, () => console.log(`API Server listening on port ${port}`));




