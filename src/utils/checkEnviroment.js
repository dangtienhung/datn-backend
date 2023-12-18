const Enviroment = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Đây là môi trường phát triển');
    return `http://localhost:5173`;
  } else if (process.env.NODE_ENV === 'production') {
    console.log('Đây là môi trường sản phẩm');
    return `https://fe-du-an-tot-nghiep-hrdg4lmqx-dangtienhung.vercel.app`;
  } else {
    return 'http://localhost:5173';
  }
};

export default Enviroment;
