function DeliveryRunner({ className = '', size = 36 }) {
  return (
    <svg
      className={className}
      width={size}
      height={(size * 32) / 48}
      viewBox="0 0 48 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="22" cy="30.4" rx="7.5" ry="1.2" fill="#17202a" opacity="0.1" />
      <path d="M7 16.5l6-2.2" stroke="#ff9494" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M5.5 20l5-1.4" stroke="#ffc2c2" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M6 12.5l3.4-1" stroke="#ffd4d4" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          dur="0.95s"
          repeatCount="indefinite"
          values="0 0; 0 -2.4; 0 0"
          keyTimes="0;0.5;1"
          calcMode="spline"
          keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
        />
        <g>
          <line x1="21" y1="12.5" x2="14.5" y2="15.5" stroke="#17202a" strokeWidth="2.2" strokeLinecap="round" />
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="0.95s"
            repeatCount="indefinite"
            values="18 21 12.5; -16 21 12.5; 18 21 12.5"
            keyTimes="0;0.5;1"
            calcMode="spline"
            keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
          />
        </g>
        <g>
          <line x1="22" y1="20" x2="18.5" y2="29" stroke="#17202a" strokeWidth="2.2" strokeLinecap="round" />
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="0.95s"
            repeatCount="indefinite"
            values="18 22 20; -28 22 20; 18 22 20"
            keyTimes="0;0.5;1"
            calcMode="spline"
            keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
          />
        </g>
        <line x1="21" y1="12.5" x2="22.5" y2="20" stroke="#17202a" strokeWidth="2.4" strokeLinecap="round" />
        <g>
          <line x1="22.5" y1="20" x2="26.5" y2="29.5" stroke="#17202a" strokeWidth="2.2" strokeLinecap="round" />
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="0.95s"
            repeatCount="indefinite"
            values="-28 22.5 20; 18 22.5 20; -28 22.5 20"
            keyTimes="0;0.5;1"
            calcMode="spline"
            keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
          />
        </g>
        <circle cx="19.5" cy="7.8" r="3.9" fill="#17202a" />
        <path d="M15.6 7.2c0.9-2.1 3-3.1 4.9-2.9 1.9 0.2 3.1 1.6 3.2 3.3" stroke="#f84040" strokeWidth="2.1" strokeLinecap="round" fill="#f84040" fillOpacity="0.25" />
        <g>
          <rect x="27.5" y="6" width="8" height="7" rx="1.4" fill="#f84040" />
          <path d="M27.5 9.5h8" stroke="#ffffff" strokeWidth="1.1" opacity="0.9" />
          <path d="M31.5 6v7" stroke="#ffffff" strokeWidth="1.1" opacity="0.9" />
        </g>
        <g>
          <line x1="21" y1="12.5" x2="30" y2="10.5" stroke="#17202a" strokeWidth="2.2" strokeLinecap="round" />
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="0.95s"
            repeatCount="indefinite"
            values="12 21 12.5; -18 21 12.5; 12 21 12.5"
            keyTimes="0;0.5;1"
            calcMode="spline"
            keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
          />
        </g>
      </g>
    </svg>
  );
}

export default DeliveryRunner;