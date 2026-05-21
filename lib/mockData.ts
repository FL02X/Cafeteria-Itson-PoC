export const MOCK_USER = {
  id: "u001",
  name: "Carlos Mendoza",
  email: "carlos.mendoza@potros.itson.edu.mx",
  role: "student" as const,
}

export const MOCK_ADMIN_USER = {
  id: "a001",
  name: "Encargada Cafeteria",
  email: "cafeteria@itson.edu.mx",
  role: "admin" as const,
}

export type ProductOption = {
  id: string
  label: string
}

export type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  available: boolean
  sizes?: ProductOption[]
  flavors?: ProductOption[]
  extras?: ProductOption[]
}

export const CATEGORIES = [
  { id: "comida", label: "Comida", emoji: "🍱" },
  { id: "snacks", label: "Snacks", emoji: "🍿" },
  { id: "bebidas-frias", label: "Bebidas Frias", emoji: "🧊" },
  { id: "bebidas-calientes", label: "Bebidas Calientes", emoji: "☕" },
] as const

export const PRODUCTS: Product[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // BEBIDAS FRIAS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "p001",
    name: "Capuchino Frio",
    description: "Espresso con leche fria y hielo, sabor a tu eleccion.",
    price: 55,
    category: "bebidas-frias",
    imageUrl: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=80",
    available: true,
    sizes: [
      { id: "chico", label: "Chico" },
      { id: "grande", label: "Grande (+$10)" },
    ],
    flavors: [
      { id: "vainilla", label: "Vainilla" },
      { id: "caramelo", label: "Caramelo" },
      { id: "moka", label: "Moka" },
      { id: "regular", label: "Regular" },
    ],
    extras: [
      { id: "extra-shot", label: "Extra shot (+$10)" },
      { id: "sin-azucar", label: "Sin azucar" },
    ],
  },
  {
    id: "p002",
    name: "Frappe de Cajeta",
    description: "Bebida fria con base de cafe, cajeta y crema batida.",
    price: 65,
    category: "bebidas-frias",
    imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/1d/11/a0/67/de-que-prefieres-tu-frappe.jpg",
    available: true,
    sizes: [
      { id: "grande", label: "Grande" },
      { id: "jumbo", label: "Jumbo (+$15)" },
    ],
  },
  {
    id: "p003",
    name: "Frappe de Moka",
    description: "Cafe frio con chocolate, leche y crema batida.",
    price: 62,
    category: "bebidas-frias",
    imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
    available: true,
    sizes: [
      { id: "grande", label: "Grande" },
      { id: "jumbo", label: "Jumbo (+$15)" },
    ],
  },
  {
    id: "p004",
    name: "Smoothie de Fresa",
    description: "Bebida refrescante de fresa con yogurt natural.",
    price: 50,
    category: "bebidas-frias",
    imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80",
    available: true,
  },
  {
    id: "p005",
    name: "Limonada Natural",
    description: "Limon fresco con agua mineral o natural.",
    price: 30,
    category: "bebidas-frias",
    imageUrl: "https://hotelkarmel.com/wp-content/uploads/produto_limonada-natural.jpg",
    available: true,
    extras: [
      { id: "mineral", label: "Agua mineral" },
      { id: "natural", label: "Agua natural" },
    ],
  },
  {
    id: "p006",
    name: "Horchata",
    description: "Bebida tradicional mexicana de arroz con canela.",
    price: 28,
    category: "bebidas-frias",
    imageUrl: "https://keviniscooking.com/wp-content/uploads/2021/01/Horchata-square.jpg",
    available: true,
  },
  {
    id: "p007",
    name: "Jamaica",
    description: "Agua fresca de flor de jamaica, dulce o natural.",
    price: 25,
    category: "bebidas-frias",
    imageUrl: "https://blog.pizcadesabor.com/wp-content/uploads/2017/09/Agua-de-jamaica-3.jpg",
    available: true,
  },
  {
    id: "p008",
    name: "Malteada de Vainilla",
    description: "Helado de vainilla con leche, cremosa y espesa.",
    price: 55,
    category: "bebidas-frias",
    imageUrl: "https://images.unsplash.com/photo-1568901839119-631418a3910d?w=400&q=80",
    available: true,
    flavors: [
      { id: "vainilla", label: "Vainilla" },
      { id: "chocolate", label: "Chocolate" },
      { id: "fresa", label: "Fresa" },
    ],
  },
  {
    id: "p009",
    name: "Te Helado",
    description: "Te negro con hielo y limon, refrescante.",
    price: 32,
    category: "bebidas-frias",
    imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
    available: false,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BEBIDAS CALIENTES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "p010",
    name: "Latte Caliente",
    description: "Espresso con leche vaporizada al gusto.",
    price: 48,
    category: "bebidas-calientes",
    imageUrl: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&q=80",
    available: true,
    sizes: [
      { id: "chico", label: "Chico" },
      { id: "grande", label: "Grande (+$10)" },
    ],
    flavors: [
      { id: "vainilla", label: "Vainilla" },
      { id: "avellana", label: "Avellana" },
      { id: "regular", label: "Regular" },
    ],
  },
  {
    id: "p011",
    name: "Capuchino Caliente",
    description: "Clasico espresso con espuma de leche cremosa.",
    price: 45,
    category: "bebidas-calientes",
    imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80",
    available: true,
    sizes: [
      { id: "chico", label: "Chico" },
      { id: "grande", label: "Grande (+$10)" },
    ],
  },
  {
    id: "p012",
    name: "Americano",
    description: "Espresso con agua caliente, intenso y aromatico.",
    price: 35,
    category: "bebidas-calientes",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80",
    available: true,
    extras: [
      { id: "extra-shot", label: "Extra shot (+$10)" },
    ],
  },
  {
    id: "p013",
    name: "Chocolate Caliente",
    description: "Chocolate de mesa con leche, cremoso y dulce.",
    price: 40,
    category: "bebidas-calientes",
    imageUrl: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&q=80",
    available: true,
  },
  {
    id: "p015",
    name: "Moka Caliente",
    description: "Espresso con chocolate y leche vaporizada.",
    price: 52,
    category: "bebidas-calientes",
    imageUrl: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&q=80",
    available: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COMIDA
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "p016",
    name: "Torta de Pierna",
    description: "Pierna de cerdo, frijoles, jitomate, cebolla en telera.",
    price: 70,
    category: "comida",
    imageUrl: "https://www.cocinadelirante.com/sites/default/files/images/2023/11/torta-de-pierna-de-cerdo.jpg",
    available: true,
    extras: [
      { id: "aguacate", label: "Con aguacate (+$10)" },
      { id: "extra-chile", label: "Extra chile" },
      { id: "sin-cebolla", label: "Sin cebolla" },
    ],
  },
  {
    id: "p017",
    name: "Torta de Jamon",
    description: "Jamon de pierna, queso, mayonesa y verduras en telera.",
    price: 60,
    category: "comida",
    imageUrl: "https://img-global.cpcdn.com/recipes/721634630115ed06/680x781cq80/torta-de-jamon-foto-principal.jpg",
    available: true,
  },
  {
    id: "p018",
    name: "Burrito de Machaca",
    description: "Machaca con huevo, chile y frijoles en tortilla grande.",
    price: 65,
    category: "comida",
    imageUrl: "https://cdn7.kiwilimon.com/recetaimagen/27954/640x640/27108.jpg.jpg",
    available: true,
    extras: [
      { id: "queso", label: "Extra queso (+$8)" },
      { id: "salsa", label: "Salsa extra" },
    ],
  },
  {
    id: "p019",
    name: "Burrito de Asada",
    description: "Carne asada con guacamole, frijoles y queso.",
    price: 75,
    category: "comida",
    imageUrl: "https://cdn.avena.io/avena-recipes-v2/2019/10/1571780042328.jpeg",
    available: true,
  },
  {
    id: "p020",
    name: "Quesadilla de Queso",
    description: "Tortilla de harina con queso derretido.",
    price: 35,
    category: "comida",
    imageUrl: "https://www.vvsupremo.com/wp-content/uploads/2015/11/900X570_Two-Cheese-Quesadillas.jpg",
    available: true,
    extras: [
      { id: "jamon", label: "Con jamon (+$12)" },
      { id: "champi", label: "Con champinones (+$10)" },
    ],
  },
  {
    id: "p021",
    name: "Sincronizada",
    description: "Tortillas de harina con jamon y queso, doradas.",
    price: 45,
    category: "comida",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwciymqs6ntfrGHKLxd-w_kyyn5n4exMjvnw&s",
    available: true,
  },
  {
    id: "p022",
    name: "Hot Dog",
    description: "Salchicha en pan con mayonesa, mostaza y catsup.",
    price: 40,
    category: "comida",
    imageUrl: "https://cdn7.kiwilimon.com/recetaimagen/13014/960x640/18490.jpg.jpg",
    available: true,
    extras: [
      { id: "tocino", label: "Con tocino (+$12)" },
      { id: "extra-queso", label: "Extra queso (+$8)" },
    ],
  },
  {
    id: "p023",
    name: "Hamburguesa Sencilla",
    description: "Carne de res, lechuga, jitomate, cebolla y queso.",
    price: 65,
    category: "comida",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcfffMB2QFzTv3pjPg-WTvwCNUw0jiIqkLEw&s",
    available: true,
  },
  {
    id: "p024",
    name: "Tacos Dorados",
    description: "3 tacos de pollo dorados con crema, lechuga y queso.",
    price: 50,
    category: "comida",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN4VaqpspLvAyVabSnHfWyioPRDRv0mT2VJw&s",
    available: false,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SNACKS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "p025",
    name: "Papas Fritas",
    description: "Porcion de papas fritas crujientes con aderezo.",
    price: 35,
    category: "snacks",
    imageUrl: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80",
    available: true,
    extras: [
      { id: "queso", label: "Con queso (+$10)" },
      { id: "salsa", label: "Salsa extra" },
    ],
  },
  {
    id: "p026",
    name: "Nachos con Queso",
    description: "Totopos con queso fundido y jalapenos.",
    price: 42,
    category: "snacks",
    imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&q=80",
    available: true,
  },
  {
    id: "p027",
    name: "Elote en Vaso",
    description: "Elote desgranado con mayonesa, chile y queso.",
    price: 30,
    category: "snacks",
    imageUrl: "https://i.pinimg.com/564x/f3/fa/57/f3fa576c70b86a7e9a4138d1c1da9983.jpg",
    available: true,
    extras: [
      { id: "extra-queso", label: "Extra queso (+$5)" },
      { id: "extra-chile", label: "Extra chile" },
    ],
  },
  {
    id: "p028",
    name: "Fruta con Chile",
    description: "Mix de fruta fresca con chile, limon y sal.",
    price: 35,
    category: "snacks",
    imageUrl: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&q=80",
    available: true,
  },
  {
    id: "p029",
    name: "Galletas Caseras",
    description: "4 galletas de avena con chispas de chocolate.",
    price: 28,
    category: "snacks",
    imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80",
    available: true,
  },
  {
    id: "p030",
    name: "Muffin de Platano",
    description: "Panque de platano con nuez, esponjoso.",
    price: 32,
    category: "snacks",
    imageUrl: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&q=80",
    available: true,
    flavors: [
      { id: "platano", label: "Platano" },
      { id: "chocolate", label: "Chocolate" },
      { id: "arandano", label: "Arandano" },
    ],
  },
  {
    id: "p031",
    name: "Concha de Chocolate",
    description: "Pan dulce tradicional mexicano con cobertura de chocolate.",
    price: 18,
    category: "snacks",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
    available: true,
  },
  {
    id: "p032",
    name: "Croissant",
    description: "Croissant de mantequilla, horneado fresco.",
    price: 28,
    category: "snacks",
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80",
    available: true,
    extras: [
      { id: "jamon-queso", label: "Con jamon y queso (+$15)" },
    ],
  },
  {
    id: "p033",
    name: "Barra de Cereal",
    description: "Barra energetica de avena con frutos secos.",
    price: 22,
    category: "snacks",
    imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
    available: true,
  },
]

export const PICKUP_TIMES = [
  { id: "15", label: "15 minutos", short: "15 min" },
  { id: "30", label: "30 minutos", short: "30 min" },
  { id: "60", label: "1 hora", short: "1 hora" },
] as const

export type PickupTimeId = (typeof PICKUP_TIMES)[number]["id"]

export type OrderStatus = "recibido" | "en-preparacion" | "listo"

export type CartItem = {
  cartItemId: string
  productId: string
  productName: string
  imageUrl: string
  price: number
  unitPrice: number
  quantity: number
  selectedSize?: string
  selectedFlavor?: string
  selectedExtras?: string[]
  note?: string
}

export type Order = {
  id: string
  orderNumber: string
  userId: string
  userName: string
  items: CartItem[]
  total: number
  pickupTime: string
  createdAt: string
  status: OrderStatus
  note?: string
}

export const MOCK_ORDERS: Order[] = [
  {
    id: "ord001",
    orderNumber: "042",
    userId: "u001",
    userName: "Carlos Mendoza",
    items: [
      {
        cartItemId: "ci-mock-1",
        productId: "p001",
        productName: "Capuchino Frio",
        imageUrl: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=80",
        price: 55,
        unitPrice: 55,
        quantity: 1,
        selectedSize: "Grande",
        selectedFlavor: "Vainilla",
      },
    ],
    total: 55,
    pickupTime: "30",
    createdAt: new Date().toISOString(),
    status: "en-preparacion",
  },
  {
    id: "ord002",
    orderNumber: "043",
    userId: "u002",
    userName: "Sofia Valenzuela",
    items: [
      {
        cartItemId: "ci-mock-2",
        productId: "p016",
        productName: "Torta de Pierna",
        imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80",
        price: 80,
        unitPrice: 80,
        quantity: 1,
        selectedExtras: ["Con aguacate"],
      },
      {
        cartItemId: "ci-mock-3",
        productId: "p025",
        productName: "Papas Fritas",
        imageUrl: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80",
        price: 35,
        unitPrice: 35,
        quantity: 1,
      },
    ],
    total: 115,
    pickupTime: "15",
    createdAt: new Date().toISOString(),
    status: "recibido",
  },
]
