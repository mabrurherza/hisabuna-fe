// const LoadingDots = () => {


//     const containerStyle = {
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: "100%",
//         height: "100%",
//     };

//     const dotContainerStyle = {
//         display: 'flex',
//     };

//     const dotStyle = {
//         width: '10px',
//         height: '10px',
//         backgroundColor: '#007bff', // You can customize the color
//         borderRadius: '50%',
//         margin: '0 5px',
//         animation: 'loadingAnimation 1s infinite ease-in-out',
//     };

//     return (
//         <>
//             <style>
//                 {`
//                         @keyframes loadingAnimation {
//                             0%, 20%, 80%, 100% {
//                             transform: scale(1);
//                             }
//                             50% {
//                             transform: scale(1.5);
//                             }
//                         }
//                         `}
//             </style>
//             <div style={containerStyle}>
//                 <div style={{ ...dotStyle, animationDelay: '0.2s' }}></div>
//                 <div style={{ ...dotStyle, animationDelay: '0.4s' }}></div>
//                 <div style={{ ...dotStyle, animationDelay: '0.6s' }}></div>
//             </div>

//         </>



//     );
// };

// export default LoadingDots;


import React from "react";

const LoadingDots = () => {
    return (
        <>

            <div className="loading-dots">
                <div className="dot dot-1" />
                <div className="dot dot-2" />
                <div className="dot dot-3" />
            </div>

            <style>
                {`.loading-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 100%;
}

.dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #34D399;
  animation: dot-animation 1s ease-in-out infinite;
}

.dot-1 {
  animation-delay: 0s;
}

.dot-2 {
  animation-delay: 0.2s;
}

.dot-3 {
  animation-delay: 0.4s;
}

@keyframes dot-animation {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}`}

            </style>
        </>
    );
};

export default LoadingDots;

// styles.css
