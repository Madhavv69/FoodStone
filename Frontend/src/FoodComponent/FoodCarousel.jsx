const FoodCarousel = ({ item }) => {
  return (
    <div
      id="carouselExampleCaptions2"
      className="carousel slide"
      data-bs-ride="false"
    >
      {/* Custom Styles */}
      <style>
        {`
          .carousel-control-prev-icon,
          .carousel-control-next-icon {
            background-image: none;
          }

          .carousel-control-prev-icon::after,
          .carousel-control-next-icon::after {
            content: '';
            display: inline-block;
            width: 20px;
            height: 20px;
            border: solid black;
            border-width: 0 3px 3px 0;
            padding: 5px;
          }

          .carousel-control-prev-icon::after {
            transform: rotate(135deg);
          }

          .carousel-control-next-icon::after {
            transform: rotate(-45deg);
          }
        `}
      </style>

      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions2"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions2"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions2"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>

      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src={`http://localhost:8080/api/food/${item.image1}`}
            className="d-block card-img-top img-fluid"
            alt="Food Image 1"
            style={{
              maxHeight: "450px",
              width: "auto",
              margin: "0 auto",
            }}
          />
        </div>
        <div className="carousel-item">
          <img
            src={`http://localhost:8080/api/food/${item.image2}`}
            className="d-block card-img-top img-fluid"
            alt="Food Image 2"
            style={{
              maxHeight: "450px",
              width: "auto",
              margin: "0 auto",
            }}
          />
        </div>
        <div className="carousel-item">
          <img
            src={`http://localhost:8080/api/food/${item.image3}`}
            className="d-block card-img-top img-fluid"
            alt="Food Image 3"
            style={{
              maxHeight: "450px",
              width: "auto",
              margin: "0 auto",
            }}
          />
        </div>
      </div>

      {/* Arrow Buttons */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleCaptions2"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleCaptions2"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default FoodCarousel;
