"use client";
import React, { useEffect, useState } from 'react';
import GlobalApi from '@/app/_utils/GlobalApi';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import MyOrderItem from './_components/MyOrderItem';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function MyOrder() {
  const jwt = sessionStorage.getItem('jwt');
  const user = JSON.parse(sessionStorage.getItem('user'));
  const router = useRouter();
  const [orderList, setOrderList] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(false);

  const [refundReason, setRefundReason] = useState('');
  const [refundMethod, setRefundMethod] = useState('GCash');
  const [refundImage, setRefundImage] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isReturnRefundDialogOpen, setReturnRefundDialogOpen] = useState(false);
  const [isCancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [isReceiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [orderToReceive, setOrderToReceive] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') { 
      const jwt = sessionStorage.getItem('jwt');
      
      if (!jwt) {
        router.replace('/');
        return;
      }
  
      const getMyOrder = async () => {
        setLoading(true);
        try {
          const user = JSON.parse(sessionStorage.getItem('user')); 
          const orderList_ = await GlobalApi.getMyOrder(user.id, jwt);
          const sortedOrders = orderList_.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOrderList(sortedOrders);
          setFilteredOrders(sortedOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      };
  
      getMyOrder();
    }
  }, [router]);
  
  const returnToStock = async (orderItems) => {
    for (const item of orderItems) {
      if (!item.productId) {
        console.error("Missing productId for item:", item);
        continue;
      }
      try {
        const currentStock = await GlobalApi.getProductStock(item.productId, jwt);
        const newStock = currentStock + item.quantity;
        await GlobalApi.updateProductStock(item.productId, newStock, jwt);
      } catch (error) {
        console.error(`Error returning item ${item.productId} to stock:`, error);
      }
    }
  };

  const cancelOrder = async (orderId, orderItems) => {
    setLoading(true);
    try {
      await GlobalApi.cancelOrder(orderId, jwt);
      await returnToStock(orderItems);

      setOrderList((prevOrders) =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
      filterOrders(filterStatus);
    } catch (error) {
      console.error("Error cancelling order:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = (status) => {
    setFilterStatus(status);
    if (status === "All") {
      setFilteredOrders(orderList);
    } else {
      setFilteredOrders(orderList.filter(order => order.status === status));
    }
  };

  const handleReturnRefund = async () => {
    if (!refundReason || !refundMethod || !refundImage) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    try {
      console.log("Processing return/refund", {
        orderId: selectedOrderId,
        refundReason,
        refundMethod,
        refundImage,
      });

      await GlobalApi.processReturnRefund(selectedOrderId, jwt, refundReason, refundMethod, refundImage);

      setRefundReason('');
      setRefundMethod('GCash');
      setRefundImage(null);
      setSelectedOrderId(null);
      setReturnRefundDialogOpen(false);
    } catch (error) {
      console.error("Error processing return/refund:", error);
    }
  };

  const receiveOrder = async (orderId, orderItems) => {
    setLoading(true);
    try {

      await GlobalApi.receiveOrder(orderId, jwt); 

      setOrderList((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Completed" } : order
        )
      );
      filterOrders(filterStatus); 
    } catch (error) {
      console.error("Error receiving order:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="p-3 bg-primary text-3xl font-bold text-center text-white mb-3">My Orders</h2>
      <div className="container mx-auto px-4">
        <h2 className="mt-2 text-2xl font-bold text-primary">Order History</h2>

        {/* Status Buttons */}
        <div className="flex gap-2 flex-wrap mt-4">
          {["All", "Pending", "Confirmed", "To Ship", "Delivered", "Completed", "Cancelled"].map((status, index) => {
            let buttonStyle = "px-4 py-2 font-semibold rounded w-full sm:w-auto ";
            switch (status) {
              case "All":
                buttonStyle += filterStatus === status ? "bg-gray-600 text-white" : "bg-gray-300 text-gray-700";
                break;
              case "Pending":
                buttonStyle += filterStatus === status ? "bg-yellow-400 text-white" : "bg-yellow-300 text-gray-700";
                break;
              case "Confirmed":
                buttonStyle += filterStatus === status ? "bg-orange-500 text-white" : "bg-orange-300 text-gray-700";
                break;
              case "To Ship":
                buttonStyle += filterStatus === status ? "bg-blue-500 text-white" : "bg-blue-300 text-gray-700";
                break;
              case "Delivered":
                buttonStyle += filterStatus === status ? "bg-teal-500 text-white" : "bg-teal-300 text-gray-700";
                break;
              case "Completed":
                buttonStyle += filterStatus === status ? "bg-green-500 text-white" : "bg-green-300 text-gray-700";
                break;
              case "Cancelled":
                buttonStyle += filterStatus === status ? "bg-red-500 text-white" : "bg-red-300 text-gray-700";
                break;
              default:
                buttonStyle += "bg-gray-300 text-gray-700";
            }

            return (
              <button
                key={index}
                onClick={() => filterOrders(status)}
                className={buttonStyle}
              >
                {status}
              </button>
            );
          })}
        </div>

        {loading && <div className="loading-spinner">Loading...</div>}

        {/* Orders List */}
        <div className="mt-5 w-full">
          {filteredOrders.map((item, index) => {
            let bgColor;
            switch (item.status) {
              case "Pending":
                bgColor = "bg-yellow-200";
                break;
              case "Confirmed":
                bgColor = "bg-orange-200";
                break;
              case "To Ship":
                bgColor = "bg-blue-200";
                break;
              case "Delivered":
                bgColor = "bg-teal-200";
                break;
              case "Completed":
                bgColor = "bg-green-200";
                break;
              case "Cancelled":
                bgColor = "bg-red-200";
                break;
              default:
                bgColor = "bg-gray-200";
            }
            return (
              <Collapsible key={index}>
                <CollapsibleTrigger className='w-full'>
                  <div className={`p-3 m-2 flex flex-col sm:flex-row gap-2 sm:gap-10 rounded-md ${bgColor}`}>
                    <h2>
                      <span className="font-bold mr-2">Order ID:</span>
                      <span>{item?.paymentId?.substring(0, 8)}</span>
                    </h2>
                    <h2>
                      <span className="font-bold mr-2">Order Date: </span>
                      <span>{moment(item?.createdAt).format('DD/MMM/yyyy')}</span>
                    </h2>
                    <h2>
                      <span className="font-bold mr-2">Status:</span>
                      <span>{item?.status}</span>
                    </h2>
                    <h2>
                      <span className="font-bold mr-2">Total Amount:</span>
                      <span>{item?.totalOrderAmount}</span>
                    </h2>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {item.orderItemList?.map((order, index_) => (
                    <MyOrderItem orderItem={order} key={index_} />
                  ))}
                  <div className="ml-[1050px] flex gap-2">
                    {/* Cancel Order Button */}
                    {(item.status === "Pending" || item.status === "Confirmed") && (
                    <AlertDialog open={isCancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                      <AlertDialogTrigger>
                        <button
                          className={`px-4 py-2 mt-2 text-sm rounded font-bold text-white ${
                            item.status === "Pending" || item.status === "Confirmed"
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!(item.status === "Pending" || item.status === "Confirmed")}
                          onClick={() => setOrderToCancel(item)}
                        >
                          Cancel Order
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Cancel Order</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel this order?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              if (orderToCancel) {
                                cancelOrder(orderToCancel.id, orderToCancel.orderItemList);
                              }
                              setCancelDialogOpen(false);
                            }}
                          >
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>)}

                    {/* Return/Refund Button */}
                    {(item.status === "Delivered" || item.status === "Completed") && (
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <button
                            className={`px-4 py-2 mt-2 text-sm rounded font-bold text-white ${
                              item.status === "Cancelled" || item.status === "Confirmed" || item.status === "To Ship" || item.status === "Pending" ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white'
                            }`}
                            disabled={item.status === "Cancelled" || item.status === "To Ship" || item.status === "Pending" || item.status === "Confirmed"}
                            onClick={() => {
                              setSelectedOrderId(item.id);
                              setReturnRefundDialogOpen(true); // Open the Return/Refund dialog
                            }}
                          >
                            Return/Refund
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-xl max-h-[80vh]">
                          <AlertDialogHeader>
                            <AlertDialogTitle className='text-2xl'>
                              Return/Refund Request
                            </AlertDialogTitle>
                            <AlertDialogDescription className='text-xl'>
                              Please provide the details for the return/refund request.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <div className="flex flex-col gap-2 mr-8">
                              <textarea 
                                placeholder="Reason for return/refund"
                                value={refundReason}
                                onChange={(e) => setRefundReason(e.target.value)}
                                className="p-2 border rounded h-32"
                              />
                              <div>
                                <label>Refund Method:</label>
                                <select 
                                  value={refundMethod} 
                                  onChange={(e) => setRefundMethod(e.target.value)}
                                  className="p-2 border rounded"
                                >
                                  <option value="GCash">GCash</option>
                                  <option value="Bank">Bank Account</option>
                                </select>
                              </div>
                              <div>
                                <label>Account Number:</label>
                                <input 
                                  type="number" 
                                  placeholder="Enter your account number"
                                  className="p-2 border rounded"
                                />
                              </div>
                              <div>
                                <label>Upload Proof:</label>
                                <input 
                                  type="file" 
                                  onChange={(e) => setRefundImage(e.target.files[0])}
                                  className="p-2 border rounded"
                                />
                              </div>
                              <AlertDialogAction onClick={handleReturnRefund}>
                                Submit Request
                              </AlertDialogAction>
                              <AlertDialogCancel onClick={() => setReturnRefundDialogOpen(false)}>No</AlertDialogCancel>
                            </div>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    {/* Receive Order Button */}
                    {(item.status === "Delivered") && (
                    <AlertDialog open={isReceiveDialogOpen} onOpenChange={setReceiveDialogOpen}>
                      <AlertDialogTrigger>
                        <button
                          className={`px-4 py-2 mt-2 text-sm rounded font-bold text-white ${
                            item.status === "Delivered"
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!(item.status === "Delivered" )}
                          onClick={() => setOrderToReceive(item)}
                        >
                          Order Received
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Receive Order</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to confirm that you&apos;ve received this order?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              if (orderToReceive) {
                                receiveOrder(orderToReceive.id, orderToReceive.orderItemList);
                              }
                              setReceiveDialogOpen(false);
                            }}
                          >
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MyOrder;
