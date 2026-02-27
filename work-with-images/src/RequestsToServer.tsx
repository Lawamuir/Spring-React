import axios from "axios";

const BASE_URL = "http://localhost:8080/"

export const addUser = (login:string, pass:string) =>
    axios.get(BASE_URL+'sign-in/' + login +'/'+pass);

export const getUser = (login:string, pass:string) =>
    axios.get(BASE_URL+'log/' + login +'/'+pass);

export const getBuildingWays = () =>
    axios.get(BASE_URL+'bit-map-ways');

export const userChoseWay = (index:number) =>
    axios.get(BASE_URL+'choosen-way/' + index);

export const deleteLatestIm = () =>
    axios.delete(BASE_URL + "/delete-latest-original")

export const uploadImage = (image:FormData) =>
    axios.post(BASE_URL+'download-image', image, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });