const Enviroment = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Đây là môi trường phát triển');
    return `http://localhost:5173`;
  } else if (process.env.NODE_ENV === 'production') {
    console.log('Đây là môi trường sản phẩm');
    return 'https://milktea-connect.vercel.app';
  } else {
    return 'https://milktea-connect.vercel.app';
  }
};

export default Enviroment;
