const mongoose = require('mongoose');
const Bike = require('./models/Bike'); // Adjust path as needed

mongoose.connect('mongodb://localhost:27017/royalBikeClub', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const bikes = [
    { name: 'Royal Enfield Classic 350', price: 185000, rentalPrice: 2000, category: 'Cruiser', description: 'Timeless design with a classic feel and powerful engine', image: '/images/Classic350.jpg' },
    { name: 'Royal Enfield Hunter 350', price: 149000, rentalPrice: 1800, category: 'Cruiser', description: 'Stylish and rugged, ideal for urban and off-road riding', image: '/images/Hunter350.jpg' },
    { name: 'Honda CB350', price: 195000, rentalPrice: 2200, category: 'Cruiser', description: 'Modern classic with a powerful 350cc engine and advanced features', image: '/images/CB350.jpg' },
    { name: 'Bajaj Pulsar NS200', price: 150000, rentalPrice: 1700, category: 'Sport', description: 'High-performance motorcycle with aggressive styling', image: '/images/BajajPulsarNs200.jpg' },
    { name: 'KTM Duke 390', price: 260000, rentalPrice: 3000, category: 'Sport', description: 'Dynamic and powerful with advanced features for a thrilling ride', image: '/images/KTMDuke390.jpg' },
    { name: 'Yamaha MT-15', price: 180000, rentalPrice: 2000, category: 'Sport', description: 'Aggressive design with a focus on performance and handling', image: '/images/YamhaMT15.jpg' },
    { name: 'Hero Splendor Plus', price: 85000, rentalPrice: 1200, category: 'Commuter', description: 'Reliable and fuel-efficient motorcycle for daily commuting', image: '/images/HeroSplendorPlus.jpg' },
    { name: 'Honda Activa 6G', price: 85000, rentalPrice: 1300, category: 'Scooter', description: 'Popular scooter with excellent fuel efficiency and comfort', image: '/images/activa-6g65e80a97062a4.jpg' },
    { name: 'TVS Jupiter', price: 74000, rentalPrice: 1100, category: 'Scooter', description: 'Versatile and stylish scooter with good performance', image: '/images/jupiter.jpg' },
    { name: 'Suzuki Gixxer', price: 155000, rentalPrice: 1800, category: 'Sport', description: 'Sharp handling and modern features in a stylish package', image: '/images/suzukiGixxer.jpg' },
    { name: 'Royal Enfield Interceptor 650', price: 300000, rentalPrice: 3500, category: 'Cruiser', description: 'Powerful twin-cylinder engine with classic styling', image: '/images/interceptor650.jpg' },
    { name: 'Kawasaki Ninja ZX-6R', price: 650000, rentalPrice: 6000, category: 'Sport', description: 'High-performance sportbike with cutting-edge technology', image: '/images/kawasakiNinja.jpg' },
    { name: 'Harley-Davidson Iron 883', price: 750000, rentalPrice: 7000, category: 'Cruiser', description: 'Iconic design with a powerful V-twin engine', image: '/images/HarleyDavidson.jpg' },
    { name: 'BMW G 310 R', price: 320000, rentalPrice: 3500, category: 'Sport', description: 'Premium entry-level motorcycle with a refined engine', image: '/images/BMWG310.jpg' },
    { name: 'Benelli Leoncino 500', price: 450000, rentalPrice: 4000, category: 'Adventure', description: 'Stylish and capable motorcycle for adventurous rides', image: '/images/benelli-select-model-red.jpg' },
    { name: 'Mahindra Mojo XT300', price: 200000, rentalPrice: 2200, category: 'Adventure', description: 'Adventure-ready with robust features and comfortable ride', image: '/images/m_mojo.jpg' },
    { name: 'Aprilia SR 150', price: 80000, rentalPrice: 1100, category: 'Scooter', description: 'Sporty scooter with aggressive design and performance', image: '/images/black-aprilia-sr150.jpg' }
];

Bike.insertMany(bikes)
    .then(() => {
        console.log('Bikes added');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error(err);
        mongoose.connection.close();
    });
