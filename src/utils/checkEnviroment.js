const Enviroment = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Đây là môi trường phát triển');
    return `https://milk-tea-connect.click`;
  } else if (process.env.NODE_ENV === 'production') {
    console.log('Đây là môi trường sản phẩm');
    return `https://milk-tea-connect.click`;
  } else {
    return 'https://milk-tea-connect.click';
  }
};

export default Enviroment;
