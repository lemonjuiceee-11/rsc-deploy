const { default: axios } = require("axios");

const axiosClient=axios.create({
    baseURL:'http://192.168.0.105:1337/api'
})

const getCategory=()=>axiosClient.get('/categories?populate=*');

const getSliders=()=>axiosClient.get('/sliders?populate=*').then(resp=>{
    return resp.data.data
});

const getBrandList=()=>axiosClient.get('/brands?populate=*').then(resp=>{
    return resp.data.data
});

const getAllProducts = () => 
    axiosClient.get('/products?pagination[limit]=-1&populate=*')
      .then(resp => {
        return resp.data.data;
      });
  

const getProductsByBrand = (brand) =>
    axiosClient.get(`/products?filters[brands][name][$in]=${brand}&pagination[limit]=-1&populate=*`)
      .then(resp => {
        return resp.data.data;
      });
  
const registerUser=(username,email,password)=>axiosClient.post('/auth/local/register',{
    username:username,
    email:email,
    password:password
});

const SignIn=(email,password)=>axiosClient.post('/auth/local',{
    identifier:email,
    password:password,
 
})

const addToCart=(data,jwt)=>axiosClient.post('/user-carts',data,{
    headers:{
        Authorization:'Bearer '+jwt
    }
});


const getCartItems = (userId, jwt) => 
    axiosClient.get('/user-carts?filters[userId][$eq]='+userId+'&[populate][products][populate][images][populate][0]=url', {
        headers: {
            Authorization: 'Bearer ' + jwt
        }
    }).then(resp => {
        const data = resp.data.data;
        const cartItemsList = data.map((item, index) => ({
            name: item.attributes.products?.data[0].attributes.name,
            quantity: item.attributes.quantity,
            amount: item.attributes.amount,
            image: item.attributes.products?.data[0].attributes.images?.data[0]?.attributes?.url, 
            price: item.attributes.products?.data[0].attributes.price,
            variation: item.attributes.products?.data[0].attributes.variation,
            stock: item.attributes.products?.data[0].attributes.stock,
            id: item.id, 
            product: item.attributes.products?.data[0].id
        }));

        return cartItemsList;
    });

    


const deleteCartItem=(id,jwt)=>axiosClient.delete('/user-carts/'+id,
{
    headers:{
        Authorization:'Bearer '+jwt
    }
})

const createOrder=(data,jwt)=>axiosClient.post('/orders',data,{
    headers:{
        Authorization:'Bearer '+jwt
    }
});


const getMyOrder=(userId, jwt)=>axiosClient.get('/orders?filters[userId][$eq]='+userId+'&populate[orderItemList][populate][product][populate][images]=url')
.then(resp=>{
    const response=resp.data.data;
    const orderList=response.map(item=>({
        id:item.id,
        totalOrderAmount:item.attributes.totalOrderAmount,
        paymentId:item.attributes.paymentId,
        orderItemList:item.attributes.orderItemList,
        createdAt:item.attributes.createdAt,
        status:item.attributes.status,
        variation:item.attributes.variation,
        paymentMethod:item.attributes.paymentMethod,
        address: item.attributes.address,
    }));

    return orderList;
})


const updateProductStock = (productId, quantity, jwt) => {
    return axiosClient.put(`/products/${productId}`, {
        data: {
            stock: quantity
        }
    }, {
        headers: {
            Authorization: 'Bearer ' + jwt
        }
    });
};

const clearCart = async (userId, jwt) => {
    try {
        const cartItems = await getCartItems(userId, jwt);
        const deletePromises = cartItems.map(item => deleteCartItem(item.id, jwt));
        await Promise.all(deletePromises);
        return true;
    } catch (error) {
        console.error("Error clearing cart:", error);
        return false;
    }
};

const cancelOrder = (orderId, jwt) => {
    return axiosClient.put(`/orders/${orderId}`, {
        data: {
            status: "Cancelled"
        }
    }, {
        headers: {
            Authorization: 'Bearer ' + jwt
        }
    });
};

const receiveOrder = (orderId, jwt) => {
    return axiosClient.put(`/orders/${orderId}`, {
        data: {
            status: "Completed"
        }
    }, {
        headers: {
            Authorization: 'Bearer ' + jwt
        }
    });
};

const getProductStock = (productId, jwt) => {
    return axiosClient.get(`/products/${productId}`, {
        headers: {
            Authorization: 'Bearer ' + jwt
        }
    }).then(resp => resp.data.data.attributes.stock);
};

const getUser = (jwt) => {
    return axiosClient.get('/users/me', {
        headers: {
            Authorization: 'Bearer ' + jwt
        }
    }).then(resp => {
        const user = resp.data;
        return {
            username: user.username,
            email: user.email,
            password: user.password,
            icon: user.icon
        };
    });
};

const updateUser = (data, jwt) => {
    console.log("Updating user with data:", data); // Log data for debugging
    return axiosClient.put('/users/me', data, {
        headers: {
            Authorization: 'Bearer ' + jwt // Correctly include JWT for authentication
        }
    });
};





export default{
    getCategory,
    getSliders,
    getBrandList,
    getAllProducts,
    getProductsByBrand,
    registerUser,
    SignIn,
    addToCart,
    getCartItems,
    deleteCartItem,
    createOrder,
    getMyOrder,
    updateProductStock,
    clearCart,
    cancelOrder,
    receiveOrder,
    getProductStock,
    getUser,
    updateUser,

}