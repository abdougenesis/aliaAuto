import axios from 'axios';

class CarAnnounceApi {
  getAllAnnounce(parent) {
    axios
      .post(
        '/backservice/car-annoucement/all',
        {page: 0, size: 25, sort: 'DATADESC', searchDetails: null},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then((res) => res.data)
      .then((res) => {
        console.log(res);
        parent.setState({annonces: res});
      })
      .catch((err) => {
        console.log(err);
        console.log(err.response);
      });
  }
}

export default CarAnnounceApi;
