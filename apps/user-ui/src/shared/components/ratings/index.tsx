import React from "react";

interface RatingsProps {
  rating: number;
  maxStars?: number;
  size?: number;
}

const Ratings: React.FC<RatingsProps> = ({
  rating,
  maxStars = 5,
  size = 26,
}) => {
  const safeRating = Math.max(0, Math.min(rating, maxStars));
  const fullStars = Math.floor(safeRating);
  const hasHalfStar =
    safeRating - fullStars >= 0.25 && safeRating - fullStars < 0.75;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  const starStyle = {
    width: size,
    height: size,
    marginRight: 4,
    color: "#e7c60c",
    display: "inline-block",
    verticalAlign: "middle",
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <svg
          key={"full-" + i}
          style={starStyle}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
      {/* Half star */}
      {hasHalfStar && (
        <svg key="half" style={starStyle} viewBox="0 0 24 24">
          <defs>
            <linearGradient id="half-grad">
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#e4e4e4" />
            </linearGradient>
          </defs>
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            fill="url(#half-grad)"
          />
        </svg>
      )}
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <svg
          key={"empty-" + i}
          style={starStyle}
          viewBox="0 0 24 24"
          fill="#e4e4e4"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
};

export default Ratings;
