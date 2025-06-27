import ListingsPage from "./ListingsPage"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useState } from "react"
function HomePage() {
  const [query, setQuery] = useState({ 
    page: 1,
    limit: 20,
    sortBy: "price",
    sortType: "desc",
  });
  

  return (
    <>
      <Header setQuery={setQuery}/>
      <ListingsPage query={query}/>
      <Footer />
    </>
  )
}

export default HomePage