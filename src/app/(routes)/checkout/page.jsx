"use client"
import { useState, useEffect, useContext } from 'react';
import GlobalApi from '@/app/_utils/GlobalApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { UpdateCartContext } from '@/app/_context/UpdateCartContext';
import CartItemList from '@/app/_components/CartItemList';
import { v4 as uuidv4 } from 'uuid';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Checkout() {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const jwt = sessionStorage.getItem('jwt');

  const [email, setEmail] = useState(user?.email || "");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsEmailValid(emailRegex.test(e.target.value));
  };

  const [totalCartItem, setTotalCartItem] = useState(0);
  const { updateCart, setUpdateCart } = useContext(UpdateCartContext);
  const [cartItemList, setCartItemList] = useState([]);
  const [subtotal, setSubTotal] = useState(0);

  const [phone, setPhone] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(true); 
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(""); 
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentId, setPaymentId] = useState(() => uuidv4());
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false); 

  const router = useRouter();

  useEffect(() => {
    if (!jwt) {
      router.push('/sign-in');
    }
    getCartItems();
  }, [updateCart]);

  const getCartItems = async () => {
    const cartItemList_ = await GlobalApi.getCartItems(user.id, jwt);
    setTotalCartItem(cartItemList_?.length);
    setCartItemList(cartItemList_);
  };

  const onDeleteItem = (id) => {
    GlobalApi.deleteCartItem(id, jwt).then(() => {
      toast('Item removed!');
      getCartItems();
    });
  };

  const onClearCart = async () => {
    const success = await GlobalApi.clearCart(user.id, jwt);
    if (success) {
      toast('Cart cleared!');
      getCartItems();
    } else {
      toast.error('Failed to clear the cart');
    }
  };

  useEffect(() => {
    let total = 0;
    cartItemList.forEach(element => {
      total += element.amount;
    });
    setTotalAmount(total.toFixed(2));
    setSubTotal(total.toFixed(2));
  }, [cartItemList]);

  const calculateTotalAmount = () => {
    const shippingFee = 60;
    const discount = voucherDiscount;
    return (parseFloat(subtotal) + shippingFee - discount).toFixed(2);
  };

  const applyVoucher = (selectedVoucher) => {
    if (selectedVoucher === "RSC10") {
      const discountValue = (0.10 * totalAmount).toFixed(2);
      setVoucherDiscount(discountValue);
      setAppliedVoucher(true);
      toast('Voucher applied!');
    } else if (selectedVoucher === "RSCFS") {
      setVoucherDiscount(60);
      setAppliedVoucher(true);
      toast('Voucher applied!');
    } else {
      setVoucherDiscount(0);
      setAppliedVoucher(false);
      toast.error('Invalid voucher code.');
    }
  };

  const onApprove = () => {
    if (!isPhoneValid) {
      toast.error('Please enter a valid phone number.');
      return;
    }

    const payload = {
      data: {
        paymentId: paymentId.toString(),
        totalOrderAmount: calculateTotalAmount(),
        username,
        email,
        phone,
        address,
        orderItemList: cartItemList,
        userId: user.id,
        paymentMethod,  
        notes,
      },
    };

    GlobalApi.createOrder(payload, jwt)
      .then(() => {
        toast('Order Placed Successfully!');

        cartItemList.forEach((item) => {
          const newStock = item.stock - item.quantity;
          GlobalApi.updateProductStock(item.product, newStock, jwt)
            .catch((err) => console.error(`Error updating stock for product ID: ${item.product}`, err));
          GlobalApi.deleteCartItem(item.id, jwt);
        });

        setUpdateCart((prev) => !prev);
        router.replace('/order-confirmation');
      })
      .catch((err) => {
        console.error('Error creating order:', err);
      });
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(09|\+639)\d{9}$/; 
    setIsPhoneValid(phoneRegex.test(phone));
  };

  const handlePhoneChange = (e) => {
    const phoneValue = e.target.value;
    setPhone(phoneValue);
    validatePhoneNumber(phoneValue);
  };

  const handleAddressChange = async (e) => {
    const query = e.target.value;
    setAddress(query);
    setIsSuggestionsVisible(true);

    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=PH&q=${query}`
      );
      const results = await response.json();
      setSuggestions(results.length ? results : []);
    } catch (error) {
      console.error('Error fetching Nominatim results:', error);
    }
  };

  const handleAddressSelect = (selectedAddress) => {
    setAddress(selectedAddress.display_name);
    setIsSuggestionsVisible(false);
  };

  // Function to validate the form fields
  const validateFields = () => {
    setIsFormValid(
      email && isEmailValid &&
      phone && isPhoneValid &&
      username && address && paymentMethod &&
      subtotal > 0
    );
  };

  useEffect(() => {
    validateFields();
  }, [email, phone, username, address, paymentMethod, isEmailValid, isPhoneValid]);

  return (
    <div className="p-4 md:p-6 ">
      <h2 className='bg-primary text-3xl font-bold text-center text-white py-3 mb-5'>Checkout</h2>
      <div className='container mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <div className='p-4 bg-white shadow rounded-lg'>
            <h2 className='font-bold text-2xl mb-4'>Billing Details</h2>
            <div className='grid grid-cols-1 gap-4'>
              <Input placeholder="name@example.com" value={email} onChange={handleEmailChange} className="w-full" />
              {!isEmailValid && <p className="error-message text-red-600">Please enter a valid email address.</p>}
              <Input placeholder='Contact Name' onChange={(e) => setUsername(e.target.value)} value={username} className="w-full" />
              <Input 
                placeholder='Phone Number' 
                value={phone} 
                onChange={handlePhoneChange} 
                className="w-full" 
              />
              {!isPhoneValid && <p className="error-message text-red-600">Please enter a valid phone number.</p>}
              <div className="relative">
                <Input placeholder='Address' value={address} onChange={handleAddressChange} className="w-full" />
                {isSuggestionsVisible && suggestions.length > 0 && (
                  <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-lg max-h-40 overflow-y-auto z-10">
                    {suggestions.map((suggestion) => (
                      <li
                        key={suggestion.place_id}
                        onClick={() => handleAddressSelect(suggestion)}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        {suggestion.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <textarea 
                placeholder="Order Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="p-2 border rounded h-24"
              />
               <div className="mt-4">
              <Select onValueChange={setPaymentMethod} value={paymentMethod} defaultValue="credit-card">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash on Delivery">Cash on Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            </div>
          </div>

          <div className='p-4 bg-white shadow rounded-lg'>
            <h2 className='font-bold text-2xl mb-4'>Your Order</h2>
            <CartItemList cartItemList={cartItemList} onDeleteItem={onDeleteItem} />
            <div className='mt-4'>
              <Select onValueChange={applyVoucher} defaultValue="0">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a voucher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No Voucher</SelectItem>
                  <SelectItem value="RSC10">10% Off</SelectItem>
                  <SelectItem value="RSCFS">Free Shipping</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='mt-4'>
              <p>Subtotal: ₱{subtotal}</p>
              <p>Shipping Fee: ₱60</p>
              <p>Voucher Discount: -₱{voucherDiscount}</p>
              <p className='font-bold text-xl'>Total: ₱{calculateTotalAmount()}</p>
            </div>
          </div>
        </div>
        <Button 
          onClick={onApprove} 
          className="w-full mt-5" 
          disabled={!isFormValid} // Disable if form is not valid
        >
          Place Order
        </Button>
      </div>
    </div>
  );
}

export default Checkout;
