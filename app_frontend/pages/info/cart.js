import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
// import { getAddress } from "../datatest/address";
import { useRouter } from "next/router";

const HeaderPage = (props) => {
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
            onClick={props.openMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <Link href={"./store"}>
            <label>PODER CART</label>
            </Link>
        </motion.h1>
        <div>Profile</div>
        </motion.div>
    );
};

const ListAddresses = (props) => {
    const [dataAddresses, setDataAddresses] = useState(props.dataUser);
    const [selectAddresses, setSelectAddresses] = useState(
        dataAddresses[0]?.addresses?.[0] || null
    );
    const { data: { id, fullname, address, province, post_code ,tel} } = dataAddresses;

    const stylesListAddresses = {
        box: {
        borderRadius: "5px",
        backgroundColor: "#d9d9d9",
        marginBottom: "10px",
        padding: "10px",
        border: "2px solid black",
        color: "black",
        },
        boxSelect: {
        borderRadius: "5px",
        backgroundColor: "black",
        marginBottom: "10px",
        padding: "10px",
        color: "white",
        },
    };

    return (
        <div>
            <div style={stylesListAddresses.box}>
                <p>Name: {fullname}</p>
                <p>Address: {address}</p>
                <p>Province: {province}</p>
                <p>Post Code: {post_code}</p>
                <p>Tel: {tel}</p>
            </div>
        {/* {dataAddresses.map((user, index) => (
            <div key={index}>
            {user.addresses.map((address, idx) => (
                <div
                key={idx}
                style={
                    selectAddresses === address
                    ? stylesListAddresses.boxSelect
                    : stylesListAddresses.box
                }
                onClick={() => setSelectAddresses(address)}
                >
                <p>name: {user.name}</p>
                <p>email: {user.email}</p>
                <p>number: {user.number}</p>
                <p>
                    {address.address_type} {address.country}
                </p>
                <p>
                    {address.address_line_1} {address.address_line_2}{" "}
                    {address.district} {address.city} {address.postal_code}
                </p>
                <p>{address.state}</p>
                </div>
            ))}
            </div>
        ))} */}
        <label className=" text-black p-2 text-center"> + เพิ่มที่อยู๋</label>
        </div>
    );
};

const ListProduct = (props) => {
    const { setSelectProduct, setPriceTotal ,dataUser} = props;
    const [dataProduct, setDataProduct] = useState([]);
    const [dataProductCart, setDataProductCart] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [editProductId, setEditProductId] = useState(null);
    
    const loadDataProduct = async () => {
        try {
            const responseP = await fetch("http://127.0.0.1:8000/ecommerce/");
            const responseC = await fetch("http://localhost:3342/api/setUpCartItem");
            
            if (!responseP.ok || !responseC.ok) {
            throw new Error("Network response was not ok");
            }
            
            const jsonDataP = await responseP.json();
            const jsonDataC = await responseC.json();
            
            const dataC = jsonDataC.filter((data) => data.customer === dataUser).reverse();
            
            if (!dataC) {
            throw new Error("No CartItem data found for customer 2");
            }
        
            const productData = dataC.map((item) => {
            return jsonDataP.find((product) => product.name === item.product_name);
            });
            
            if (!productData) {
            throw new Error("No product data found for CartItem ID");
            }
            setDataProductCart(dataC);
            setDataProduct(productData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
        
    const deleteProduct = async (product) => {
        var data = {
            "id": product.id,
        };
        // console.log(product);
        try {
            const response = await fetch('http://localhost:3342/api/deleteCartItem', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            });
        
            if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage || 'Request failed');
            }
        
            alert("Item deleted from cart");
        } catch (error) {
            console.error('Delete product failed:', error);
            throw error;
        }
    };

    const handleSelectProduct = (product) => {
        const isSelected = selectedProducts.some((item) => item.id === product.id);
        if (isSelected) {
            const updatedProducts = selectedProducts.filter((item) => item.id !== product.id);
            setSelectedProducts(updatedProducts);
            setSelectProduct(updatedProducts);
        } else {
            setSelectedProducts([...selectedProducts, product]);
            setSelectProduct([...selectedProducts, product]);
        }
        };

        const handleEditProduct = (productId) => {
        setEditProductId(productId);
    };

    const handleSaveEdit = async(productId, newQuantity) => {
        const updatedProducts = dataProductCart.map((product) =>
            product.id === productId ? { ...product, quantity: newQuantity } : product
        );
        const editedProduct = updatedProducts.find(product => product.id === productId);
        try {
            const responseUpdate = await fetch('http://127.0.0.1:3342/api/updateCartItem',{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedProduct),
            })

            if (!responseUpdate.ok) {
            const errorMessage = await responseUpdate.text();
            throw new Error(errorMessage || 'Request failed');
            }
        
            alert("Updated product successfully!");
            setEditProductId(null);
            loadDataProduct();
        } catch (err) {
            console.error('Delete product failed:', error);
            throw error;
        }
    };
    

    useEffect(() => {
    loadDataProduct();
    }, [dataProductCart]);

    
    const stylesListProduct = {
    box: {
        height: "150px",
        display: "grid",
        gridTemplateColumns: "150px auto",
        marginBottom: "10px",
    },
    picture: {
        backgroundColor: "#FFFFFF",
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
    <div>
        {dataProductCart.map((product, index) => (
        <div key={index} style={stylesListProduct.box}>
            <div style={stylesListProduct.picture}>
            <img
                src={dataProduct.find((data) => data.name === product.product_name).img}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
            />
            </div>
            <div style={stylesListProduct.areaDetail}>
            <div>
                <h1 className="text-2xl font-bold text-black">{product.product_name}</h1>
                {editProductId === product.id ? (
                <div>
                    <label className="text-xl" htmlFor={`quantity_${product.id}`}>Quantity:</label>
                    <input
                    className="text-xl border border-gray-300 rounded-md mx-2 px-2 py-1 focus:outline-none focus:ring focus:ring-blue-200"
                    type="number"
                    id={`quantity_${product.id}`}
                    name={`quantity_${product.id}`}
                    placeholder={product.quantity}
                    onChange={(e) => {
                        const newQuantity = e.target.value;
                        handleSaveEdit(product.id, newQuantity);
                    }}
                    />
                </div>
                ) : (
                <h1 className="text-xl">จำนวน: {product.quantity}</h1>
                )}
                <h1 className="text-xl">ราคา: {product.price}</h1>
            </div>
            <div>
                <div className="flex justify-between text-xl gap-2 text-black">
                <div onClick={() => handleEditProduct(product.id)}>Edit</div>
                <div onClick={() => deleteProduct(product)}>Delete</div>
                </div>
                <input
                type="checkbox"
                style={{ width: "24px", height: "24px", padding: "5px" }}
                onChange={() => handleSelectProduct(product)}
                checked={selectedProducts.some((item) => item.id === product.id)}
                />
            </div>
            </div>
        </div>
        ))}
    </div>
    );
};

const ComfirmProduct = (props) => {
    const { selecProduct, priceTotal } = props;
    const [dataProductCart, setDataProductCart] = useState([]);

    const loadDataProduct = async () => {
        try {
        const responseP = await fetch("http://127.0.0.1:8000/ecommerce/");

        if (!responseP.ok) {
            throw new Error("Network response was not ok");
        }

        const jsonDataP = await responseP.json();

        const productData = selecProduct.map((item) => {
            return jsonDataP.find((product) => product.name === item.product_name);
        });

        if (!productData) {
            throw new Error("No product data found for CartItem ID");
        }
        // console.table(productData);
        setDataProductCart(productData);
        } catch (error) {
        console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        loadDataProduct();
    }, []);

    const stylesListProduct = {
        box: {
        height: "150px",
        display: "grid",
        gridTemplateColumns: "150px auto",
        marginBottom: "10px",
        },
        picture: {
        backgroundColor: "#FFFFFF",
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
        <div>
        {selecProduct.map((product, index) => (
            <div key={index} style={stylesListProduct.box}>
            <div style={stylesListProduct.picture}>
                {dataProductCart.find(
                (item) => item.name === product.product_name
                ) && (
                <img
                    src={
                    dataProductCart.find(
                        (item) => item.name === product.product_name
                    ).img
                    }
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                />
                )}
            </div>
            <div style={stylesListProduct.areaDetail}>
                <div>
                <h1 className="text-2xl font-bold">{product.product_name}</h1>
                {/* <h1>ไซร์: {product.size}</h1> */}
                <h1>จำนวน: {product.quantity}</h1>
                <h1>ราคา: {product.price}</h1>
                <h1>
                    {product.price} * {product.quantity} ={" "}
                    {product.price * product.quantity}
                </h1>
                </div>
            </div>
            </div>
        ))}
        <label className="text-black text-3xl font-bold flex justify-end px-4">
            ยอดสุุดทิ {priceTotal}
        </label>
        </div>
    );
};

export default function Cart() {
    const router = useRouter();
    const { data } = router.query;
    const parsedData = JSON.parse(data);
    const { data: { id, fullname, address ,tel} } = parsedData;

    const [preorderList, setPreorderList] = useState(false);
    const [selecProduct, setSelectProduct] = useState(null);
    const [priceTotal, setPriceTotal] = useState(0);

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
        areaButton: {
        position: "absolute",
        bottom: "20px",
        right: "15px",
        cursor: "pointer",
        },
        nextButton: {
        backgroundColor: "#d9d9d9",
        padding: "20px",
        fontWeight: "bold",
        fontSize: "24px",
        color: "black",
        borderRadius: "50px",
        },
        preorderList: {
        height: "calc(100vh - 80px)",
        backgroundColor: "#FFFFFF",
        padding: "5px",
        },
    };

    const handleTogglePreorderList = () => {
        // console.table(selecProduct);
        setPreorderList(!preorderList);
    };

    const startOder = async() => {
        const orderData = {
            customer: parsedData.data.id, // Assuming parsedData.data.id is the customer ID
            address: parsedData.data.address,
            amount: priceTotal,
            status: "Processing",
            tel: parsedData.data.tel,
            items: selecProduct.map(item => ({
                product_name: item.product_name,
                quantity: item.quantity,
                price: item.price
            }))
        };
        try {
            const response = await fetch("http://127.0.0.1:3342/api/addOrder", {
                method: "POST", 
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData), 
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || "Request failed");
            }
    
            alert("Item add from order"); // แจ้งเตือนว่าสินค้าถูกลบออกจากตะกร้า
            } catch (error) {
            console.error("Delete product failed:", error);
            throw error;
            }

        const data = selecProduct.map((item) => ({
            id: item.id
        }))
    
        try {
            const response = await fetch("http://localhost:3342/api/deleteCartItems", {
                method: "DELETE", // ใช้ method DELETE สำหรับลบสินค้า
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(data), // ส่งข้อมูลสินค้าที่ต้องการลบในรูปแบบ JSON
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || "Request failed");
            }
    
            alert("Item deleted from cart");
            setPreorderList(!preorderList) // แจ้งเตือนว่าสินค้าถูกลบออกจากตะกร้า
            } catch (error) {
            console.error("Delete product failed:", error);
            throw error;
            }
    
    }

    useEffect(() => {
        if (selecProduct !== null) {
        const totalPrice = selecProduct.reduce((total, product) => {
            return total + parseFloat(product.price) * parseFloat(product.quantity);
        }, 0);
        setPriceTotal(totalPrice);
        }
    }, [selecProduct]);

    return (
        <div className=" bg-white">
        <HeaderPage preorderList={preorderList} />

        {!preorderList ? (
            <>
            <div style={stylesCart.areaButton}>
                <motion.button
                style={stylesCart.nextButton}
                onClick={handleTogglePreorderList}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                >
                {new Intl.NumberFormat("th-TH", {
                    style: "currency",
                    currency: "THB",
                }).format(priceTotal)}
                {" "} ต่อไป
                </motion.button>
            </div>
            <motion.div
                style={stylesCart.content}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                type: "spring",
                stiffness: 120,
                damping: 14,
                ease: "easeInOut",
                }}
            >
                <div className="overflow-y-auto text-black" style={stylesCart.listaddress}>
                <ListAddresses dataUser={parsedData}/>
                {/* {address}{fullname}{tel} */}
                </div>
                <div className="overflow-y-auto" style={stylesCart.listproduct}>
                <ListProduct
                    setSelectProduct={setSelectProduct}
                    priceTotal={setPriceTotal}
                    dataUser={id}
                />
                </div>
            </motion.div>
            </>
        ) : (
            <>
            <div style={stylesCart.areaButton}>
                <div className=" grid grid-cols-2 gap-2">
                <motion.button
                    style={stylesCart.nextButton}
                    onClick={() => {
                    setPreorderList(!preorderList);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    ยกเลิก
                </motion.button>
                <motion.button
                    style={stylesCart.nextButton}
                    onClick={() => {startOder()}}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    ยืนยันสินค้า
                </motion.button>
                </div>
            </div>
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
                <ComfirmProduct
                selecProduct={selecProduct}
                priceTotal={priceTotal}
                />
            </motion.div>
            </>
        )}
        </div>
    );
}
