import React, { useEffect, useState } from "react";
import { color, motion } from "framer-motion";
import Link from "next/link";
// import { getOrderAll } from "../datatest/order";
import { useRouter } from "next/router";

const HeaderPage = () => {
    const stylesHeaderPage = {
        header: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        },
        textLogo: {
        fontSize: "36px",
        fontWeight: "bold",
        color: "black",
        padding: "10px",
        overflow: "hidden",
        cursor: "pointer",
        },
    };

    return (
        <motion.div style={stylesHeaderPage.header}>
        <motion.h1
            style={stylesHeaderPage.textLogo}
            // onClick={() => Router.push('./store')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
        >
            <Link href={"./store"}>
                <label>PODER ORDER</label>
            </Link>
        </motion.h1>
        <div>Profile</div>
        </motion.div>
    );
};

const ListOrder = (props) => {
    const router = useRouter();
    const { data } = router.query;
    const parsedData = JSON.parse(data);
    const { data: { id, fullname, address ,tel} } = parsedData;
    const [dataOrder, setDataOrder] = useState();

    async function loadDataOrder(customerId) {
        try {
            const url = `http://127.0.0.1:3342/api/getOrderPersonal?customer=${id}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || "Request failed");
            }
            
            const responseData = await response.json();
            // console.table(responseData)
            setDataOrder(responseData.reverse())
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    }
    

    useEffect(() => {
        loadDataOrder();
    }, [id]);

    const stylesListProduct = {
        box: {
        height: "150px",
        display: "grid",
        gridTemplateColumns: "150px auto",
        marginBottom: "10px",
        },
        picture: {
        backgroundColor: "#d9d9d9",
        width: "150px",
        height: "150px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        },
        areaDetail: {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        color: "black",
        },
    };

    return (
        <div className="text-black">
            {dataOrder && dataOrder.length > 0 ? (
                dataOrder.map((data, index) => (
                    <div
                        key={index}
                        style={stylesListProduct.box}
                        onClick={() => {
                            props.setOrderList(dataOrder[index])
                            // console.table(dataOrder[index]);
                        }}
                    >
                        <div style={stylesListProduct.picture}>
                            <img src={""} alt={data.id} className="max-w-full max-h-full" />
                            {data.status}
                        </div>
                        <div style={stylesListProduct.areaDetail}>
                            <div>
                                <h1 className="text-2xl font-bold">Order #{data.id}</h1>
                                <h1> date {data.order_day} </h1>
                                <h1> Status {data.status}</h1>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div>ไม่พบ Order สินค้า</div>
            )}
        </div>
    );
};

export default function Order() {

    const router = useRouter();
    const { data } = router.query;
    const parsedData = JSON.parse(data);
    const { data: { id, fullname, address ,tel} } = parsedData;

    const [orderList, setOrderList] = useState();

    const stylesCart = {
    content: {
        display: "grid",
        gridTemplateColumns: "1.5fr 6fr",
        height: "calc(100vh - 80px)",
        backgroundColor: "#FFFFFF",
    },
    listaddress: {
        padding: "5px",
    },
    listproduct: {
        padding: "5px",
    },
    nextButton: {
        backgroundColor: "#d9d9d9",
    },
    preorderList: {
        height: "calc(100vh - 80px)",
        backgroundColor: "#FFFFFF",
        padding: "5px",
    },
    orderList: {
        color: "black",
        padding: "20px",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: "Arial, sans-serif",
        marginTop: "16px",
    },
    th: {
        padding: "10px",
        textAlign: "left",
        borderBottom: "1px solid #ddd",
        backgroundColor: "#f2f2f2",
    },
    td: {
        padding: "10px",
        textAlign: "left",
        borderBottom: "1px solid #ddd",
    },
    evenRow: {
        backgroundColor: "#f2f2f2",
    },
    image: {
        maxWidth: "50px",
        height: "auto",
    },
    orderDetails: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginBottom: "16px",
    },
    totalPrice: {
        display: "flex",
        justifyContent: "flex-end",
        fontWeight: "bold",
        marginTop: "16px",
    },
    receiptButton: {
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "4px",
        cursor: "pointer",
        marginTop: "16px",
    },
    };

    return (
    <div className=" bg-white">
        <HeaderPage />
        <motion.div
        className="overflow-y-auto"
        style={stylesCart.preorderList}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
            type: "spring",
            stiffness: 120,
            damping: 14,
            ease: "easeInOut",
        }}
        >
        {orderList ? (
            <div style={stylesCart.orderList}>
            <div style={stylesCart.orderDetails}>
                <label onClick={() => console.log(orderList)}>รายการสั่งซื้อ</label>
                <p>รายการที่ {orderList.id}</p>
                <p>วันที่ {orderList.order_day}</p>
                <p>ผู้สั่ง {fullname}</p>
                <p>ที่อยู่ {orderList.address}{" "}{orderList.post_code}</p>
                <p>เบอร์โทร {orderList.tel}</p>
                <p>สถานะ {orderList.status}</p>
            </div>
            <table style={stylesCart.table}>
                <thead>
                <tr>
                    <th style={stylesCart.th}>ID Product</th>
                    <th style={stylesCart.th}>Image</th>
                    <th style={stylesCart.th}>Name</th>
                    <th style={stylesCart.th}>Quantity</th>
                    <th style={stylesCart.th}>Price</th>
                </tr>
                </thead>
                <tbody>
                {orderList.items.map((data, index) => (
                    <tr
                    key={index}
                    style={
                        index % 2 === 0
                        ? { ...stylesCart.evenRow, ...stylesCart.td }
                        : stylesCart.td
                    }
                    >
                    <td>{index+1}</td>
                    <td>
                        <img
                        // src={data.img}
                        alt={`Product ${data.id}`}
                        style={stylesCart.image}
                        />
                    </td>
                    <td>{data.product_name}</td>
                    <td>{data.quantity}</td>
                    <td>{data.price * data.quantity}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div style={stylesCart.totalPrice}>
                <span>ยอดสุทธิ {orderList.amount}</span>
            </div>
            <div style={stylesCart.totalPrice} onClick={()=>{setOrderList()}}>
                <span>{orderList.status}</span>
            </div>
            </div>
        ) : (
            <ListOrder setOrderList={setOrderList}/>
        )}
        </motion.div>
    </div>
    );
}
