const Enviroment = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Đây là môi trường phát triển');
    return `http://localhost:5173`;
  } else if (process.env.NODE_ENV === 'production') {
    console.log('Đây là môi trường sản phẩm');
    return `https://milk-tea-connect.click`;
  } else {
    return 'http://localhost:5173';
  }
};

export default Enviroment;
