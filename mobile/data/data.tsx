export  const categories = [
    { image: require("@/assets/images/electronic-devices.png"), name: "electronics" },
    { image: require("@/assets/images/teddy-bear.png"), name: "toys" },
    { image: require("@/assets/images/book.png"), name: "books" },
    { image: require("@/assets/images/football.png"), name: "sports" },
    { image: require("@/assets/images/personal.png"), name: "beauty" },
    { image: require("@/assets/images/hoodie.png"), name: "fashion" },
    { image: require("@/assets/images/house.png"), name: "home" },
    { image: require("@/assets/images/console.png"), name: "gaming" },
  ];

 export const menuItems = [
  { id: 1, icon: "person-outline", title: "Edit Profile", color: "#3B82F6", action: "/profile" },
  { id: 2, icon: "list-outline", title: "Orders", color: "#10B981", action: "/orders" },
  { id: 3, icon: "location-outline", title: "Addresses", color: "#F59E0B", action: "/addresses" },
  { id: 4, icon: "heart-outline", title: "Wishlist", color: "#EF4444", action: "/wishlist" },
] as const;