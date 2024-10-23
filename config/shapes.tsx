// Shapes

interface ShapeProps {
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
}

export const Square: React.FC<ShapeProps> = ({
  fillColor,
  strokeColor,
  strokeWidth,
}) => (
  <svg
    preserveAspectRatio="none"
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
  >
    <rect
      width="100%"
      height="100%"
      style={{
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      }}
    />
  </svg>
);

export const Circle: React.FC<ShapeProps> = ({
  fillColor,
  strokeColor,
  strokeWidth,
}) => (
  <svg
    preserveAspectRatio="none"
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
  >
    <circle
      cx="50"
      cy="50"
      r="50"
      style={{
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      }}
    />
  </svg>
);

export const Triangle: React.FC<ShapeProps> = ({
  fillColor,
  strokeColor,
  strokeWidth,
}) => (
  <svg
    preserveAspectRatio="none"
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
  >
    <polygon
      points="50,0 0,100 100,100"
      style={{
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      }}
    />
  </svg>
);

export const Heart: React.FC<ShapeProps> = ({
  fillColor,
  strokeColor,
  strokeWidth,
}) => (
  <svg
    preserveAspectRatio="none"
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
  >
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      style={{
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      }}
    />
  </svg>
);

export const Star: React.FC<ShapeProps> = ({
  fillColor,
  strokeColor,
  strokeWidth,
}) => (
  <svg
    preserveAspectRatio="none"
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
  >
    <path
      d="M12 17.27L18.18 21 16.54 14.14 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 14.14 5.82 21z"
      style={{
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      }}
    />
  </svg>
);

export const Pentagon: React.FC<ShapeProps> = ({
  fillColor,
  strokeColor,
  strokeWidth,
}) => (
  <svg
    preserveAspectRatio="none"
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
  >
    <polygon
      points="50,0 98,38 79,100 21,100 2,38"
      style={{
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      }}
    />
  </svg>
);

export const Hexagon: React.FC<ShapeProps> = ({
  fillColor,
  strokeColor,
  strokeWidth,
}) => (
  <svg
    preserveAspectRatio="none"
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
  >
    <polygon
      points="50,0 93,25 93,75 50,100 7,75 7,25"
      style={{
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      }}
    />
  </svg>
);

export const Octagon: React.FC<ShapeProps> = ({
  fillColor,
  strokeColor,
  strokeWidth,
}) => (
  <svg
    preserveAspectRatio="none"
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
  >
    <polygon
      points="30,0 70,0 100,30 100,70 70,100 30,100 0,70 0,30"
      style={{
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      }}
    />
  </svg>
);

export const Ellipse: React.FC<ShapeProps> = ({
  fillColor,
  strokeColor,
  strokeWidth,
}) => (
  <svg
    preserveAspectRatio="none"
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
  >
    <ellipse
      cx="50"
      cy="50"
      rx="50"
      ry="30"
      style={{
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      }}
    />
  </svg>
);

export const Diamond: React.FC<ShapeProps> = ({
  fillColor,
  strokeColor,
  strokeWidth,
}) => (
  <svg
    preserveAspectRatio="none"
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
  >
    <polygon
      points="50,0 100,50 50,100 0,50"
      style={{
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      }}
    />
  </svg>
);

export const Parallelogram: React.FC<ShapeProps> = ({
  fillColor,
  strokeColor,
  strokeWidth,
}) => (
  <svg
    preserveAspectRatio="none"
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
  >
    <polygon
      points="20,0 100,0 80,100 0,100"
      style={{
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      }}
    />
  </svg>
);

export const ArrowRight: React.FC<ShapeProps> = ({
  fillColor,
  strokeColor,
  strokeWidth,
}) => (
  <svg
    preserveAspectRatio="none"
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
  >
    <polygon
      points="0,45 70,45 70,25 100,50 70,75 70,55 0,55"
      style={{
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      }}
    />
  </svg>
);

export const ArrowLeft: React.FC<ShapeProps> = ({
  fillColor,
  strokeColor,
  strokeWidth,
}) => (
  <svg
    preserveAspectRatio="none"
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
  >
    <polygon
      points="100,45 30,45 30,25 0,50 30,75 30,55 100,55"
      style={{
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      }}
    />
  </svg>
);

export const Cross: React.FC<ShapeProps> = ({
  fillColor,
  strokeColor,
  strokeWidth,
}) => (
  <svg
    preserveAspectRatio="none"
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
  >
    <path
      d="M10 40 H40 V10 H60 V40 H90 V60 H60 V90 H40 V60 H10 Z"
      style={{
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      }}
    />
  </svg>
);

// Array of all shape components
export const ShapeComponentsArray = [
  {name: "Square", component: Square},
  {name: "Circle", component: Circle},
  {name: "Triangle", component: Triangle},
  {name: "Heart", component: Heart},
  {name: "Star", component: Star},
  {name: "Pentagon", component: Pentagon},
  {name: "Hexagon", component: Hexagon},
  {name: "Octagon", component: Octagon},
  {name: "Ellipse", component: Ellipse},
  {name: "Diamond", component: Diamond},
  {name: "Parallelogram", component: Parallelogram},
  {name: "ArrowRight", component: ArrowRight},
  {name: "ArrowLeft", component: ArrowLeft},
  {name: "Cross", component: Cross},
];
