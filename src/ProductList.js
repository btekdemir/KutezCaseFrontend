import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import "./ProductList.css"; // Import the CSS file

function ProductList() {
  const [products, setProducts] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(0); // Group index
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const visibleCount = 4; // Number of items visible at a time

  useEffect(() => {
    // Fetch products from the backend
    fetch("https://kutez-6f23a344b049.herokuapp.com/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSlideChange = (index) => {
    setCurrentGroup(index); // Update the current group index when the carousel changes
  };

  const handleSliderChange = (value) => {
    setCurrentGroup(value); // Update group index when the slider changes
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  // Total groups for the slider
  const totalGroups = Math.ceil(products.length / visibleCount);

  return (
    <div className="product-list-container">
      <h1 className="product-list-title">Product List</h1>

      {/* Carousel */}
      <div className="carousel-container">
        <Carousel
          showThumbs={false}
          infiniteLoop={false}
          swipeable
          showStatus={false}
          useKeyboardArrows
          emulateTouch
          centerMode={false} // Disable centering to prevent partial items
          selectedItem={currentGroup} // Sync carousel with slider
          onChange={handleSlideChange}
          renderArrowPrev={(onClickHandler, hasPrev) =>
            hasPrev && (
              <button className="carousel-arrow prev-arrow" onClick={onClickHandler}>
                ❮
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext) =>
            hasNext && (
              <button className="carousel-arrow next-arrow" onClick={onClickHandler}>
                ❯
              </button>
            )
          }
          showIndicators={false}
        >
          {Array.from({ length: totalGroups }, (_, groupIndex) => (
            <div key={groupIndex} className="carousel-group">
              {products
                .slice(
                  groupIndex * visibleCount,
                  groupIndex * visibleCount + visibleCount
                )
                .map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
            </div>
          ))}
        </Carousel>

        {/* Custom Sliding Bar */}
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max={totalGroups - 1} // Number of groups
            value={currentGroup}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="custom-slider"
          />
        </div>
      </div>
    </div>
  );
}

export default ProductList;
