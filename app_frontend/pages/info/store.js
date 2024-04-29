import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ListItem from "../component/ListItems";
import { MdOutlineTune } from "react-icons/md";
import { MdOutlineClose } from "react-icons/md";

const HeaderPage = (props) => {
    const stylesHeaderPage = {
        header: {
        position: "fixed",
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#d9d9d9",
        },
        textLogo: {
        fontSize: "36px",
        fontWeight: "bold",
        color: "black",
        padding: "10px",
        overflow: "hidden",
        cursor: "pointer",
        },
        username: {
        backgroundColor: "white",
        margin: "10px",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        },
    };

    return (
        <motion.div
        style={stylesHeaderPage.header}
        initial={{ height: "100vh", opacity: 0 }}
        animate={{ height: "80px", opacity: 1 }}
        transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
            ease: (t) => t * (1 - t) * (2 * t - 1),
        }}
        >
            <motion.h1
                style={stylesHeaderPage.textLogo}
                onClick={props.openMenu}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                PODER
            </motion.h1>
            <div style={stylesHeaderPage.username}>
                <p className="text-black">{props.user.data["fullname"]}{props.user.data["user"]}</p>
            </div>
        </motion.div>
    );
};

const Menu = (props) => {
    const dataUser = props.user

    const stylesMenu = {
        body: {
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#d9d9d9",
        },
        header: {
        display: "flex",
        justifyContent: "space-between",
        },
        textLogo: {
        fontSize: "36px",
        fontWeight: "bold",
        color: "black",
        padding: "10px",
        cursor: "pointer",
        },
        listmenu: {
        fontWeight: "bold",
        display: "grid",
        color: "black",
        padding: "10px",
        fontSize: "36px",
        },
    };

    return (
        <motion.div
        style={stylesMenu.body}
        initial={{ height: "0px", opacity: 0 }}
        animate={{ height: "100vh", opacity: 1 }}
        transition={{
            type: "spring",
            stiffness: 120,
            damping: 14,
            ease: (t) => t * (1 - t) * (2 * t - 1),
        }}
        >
        <motion.div style={stylesMenu.header}>
            <motion.h1
            style={stylesMenu.textLogo}
            onClick={props.openMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            >
            PODER
            </motion.h1>
            <div>Profile</div>
        </motion.div>
        <motion.div
            style={stylesMenu.listmenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
        >
            <motion.div whileHover={{ x: 10 }}>
            <Link href={{
              pathname: "./profile",
              query: {data: JSON.stringify(dataUser)}
              }}>
                <label className="cursor-pointer">บัญชีผู้ใช้</label>
            </Link>
            </motion.div>
            <motion.div whileHover={{ x: 10 }}>
            <Link href={{
                pathname: "./cart" ,
                query: {data: JSON.stringify(dataUser)},
            }} >
                <label className="cursor-pointer">รายการสินค้าที่เลือก</label>
            </Link>
            </motion.div>
            <motion.div whileHover={{ x: 10 }}>
            <Link href={{
                pathname: "./order" ,
                query: {data: JSON.stringify(dataUser)},
            }}>
                <label className="cursor-pointer">รายการสั่งซื้อสินค้า</label>
            </Link>
            </motion.div>
            <motion.div whileHover={{ x: 10 }}>
            <Link href="./Cart">
                <label className="cursor-pointer">ตั้งค่า</label>
            </Link>
            </motion.div>
            <motion.label whileHover={{ x: 10 }}>Menu</motion.label>
        </motion.div>
        </motion.div>
    );
};

const Filter = (props) => {
  const [dataType, setDataType] = useState([
    ...new Set(props.data.map((product) => product.type)),
  ]);
  const [dataBrand, setDataBrand] = useState([
    ...new Set(props.data.map((product) => product.brand)),
  ]);

  const stylesFilter = {
    body: {
      backgroundColor: "#FFFFFF",
      textColor: "black",
      marginTop: "80px",
      height: "360px",
    },
    scrollContainer: {
      height: "300px",
      overflowY: "auto",
      padding: "10px",
    },
  };

  useEffect(() => {}, []);

  return (
    <motion.div
      style={stylesFilter.body}
      initial={{ height: "40px", opacity: 0 }}
      animate={{ height: "360px", opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 14,
        ease: (t) => t * (1 - t) * (2 * t - 1),
      }}
    >
      <div className="flex justify-end text-black p-3 font-bold cursor-pointer">
        <MdOutlineClose
          style={{ fontSize: "32px" }}
          onClick={props.openFilter}
        />
      </div>
      <div className="text-black grid grid-flow-col">
        <div style={stylesFilter.scrollContainer}>
          <div
            className={`p-2 text-xl rounded-full border-4 ${
              props.dataFilter === "ALL" ? "border-black" : ""
            } hover:border-black mb-2`}
            onClick={() => {
              props.setDataFilter(null);
            }}
          >
            ALL
          </div>
          {dataType.map((data, index) => (
            <div
              key={index}
              className={`p-2 text-xl rounded-full border-4 ${
                props.dataFilter === data ? "border-black" : " "
              } hover:border-black mb-2`}
              onClick={() => {
                console.log("You selected Type " + data);
                props.setDataFilter(data);
              }}
            >
              {data}
            </div>
          ))}
        </div>
        <div style={stylesFilter.scrollContainer}>
          <div
            className={`p-2 text-xl rounded-full border-4 ${
              props.dataFilter === "ALL" ? "border-black" : ""
            } hover:border-black mb-2`}
            onClick={() => {
              console.log("ALL");
              // props.setDataFilter("ALL");
            }}
          >
            ALL
          </div>
          {dataBrand.map((data, index) => (
            <div
              key={index}
              className={`p-2 text-xl rounded-full border-4 ${
                props.dataFilter === data ? "border-black" : " "
              } hover:border-black mb-2`}
              onClick={() => {
                console.log("You selected Brand " + data);
                // props.setDataFilter(data);
              }}
            >
              {data}
            </div>
          ))}
        </div>
        <div style={stylesFilter.scrollContainer}>null</div>
        <div style={stylesFilter.scrollContainer}>null</div>
      </div>
    </motion.div>
  );
};

const ShowProduct = ({ productID, openModal, user }) => {
    const [sizeSelect, setSizeSelect] = useState(null);
    const addProductToCart = async () => {
        var data = {
        customer: user.data["user"],
        product_name: productID.name,
        quantity: 1,
        price: productID.price,
        };

        try {
        const response = await fetch("http://localhost:3342/api/setUpCartItem", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage || "Request failed");
        }

        const responseData = await response.json();
        openModal();
        alert("add item to cart");
        return responseData;
        } catch (error) {
        console.error("Error:", error);
        openModal();
        throw error;
        }
    };

    if (!productID) {
        return null; // Return nothing if productID is falsy
    }

    const stylesShowProduct = {
        button: {
        backgroundColor: "#d9d9d9",
        hoverBackgroundColor: "#BB0000",
        },
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50 backdrop-filter backdrop-blur-lg">
        <div className="bg-white rounded-lg shadow-md max-w-screen-lg mx-auto h-full lg:h-4/5 overflow-auto">
            <div className="grid grid-cols-1 md:grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 lg:h-full gap-6 md:gap-8">
            <div className="flex flex-col items-center md:items-center lg:justify-center p-12 mb-32">
                <img
                src={productID.img}
                alt="Product"
                className="rounded-lg w-full md:h-auto h-50vh"
                />
            </div>
            <div className="bg-gray-100 overflow-y-auto p-4">
                <div className="">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black">
                    {productID.name}
                </h1>
                <span className="text-xl md:text-2xl font-semibold text-gray-700">
                    {new Intl.NumberFormat("th-TH", {
                    style: "currency",
                    currency: "THB",
                    }).format(productID.price)}
                </span>
                </div>
                <div className="my-6 h-48 overflow-y-auto text-black">
                {productID.description}
                </div>
                <div className="flex gap-2 justify-end">
                <button
                    style={stylesShowProduct.button}
                    className={`hover:bg-red-500 text-white px-6 py-3 rounded-md self-start mt-4`}
                    onClick={() => openModal()}
                >
                    Close
                </button>
                <button
                    className=" bg-gray-500 hover:bg-green-600 text-white px-6 py-3 rounded-md self-start mt-4"
                    onClick={() => addProductToCart()}
                >
                    เพิ่มลงตระกร้า
                </button>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
};

const Store = () => {

    const [info, setInfo] = useState(null);
    const [info_list, setInfoList] = useState(null);

    const [menu, setMenu] = useState(false);
    const [filter, setFilter] = useState(false);
    const [modal, setModal] = useState(false);

    const [data, setData] = useState(null);
    const [productID, setProductID] = useState(null);

    const [dataFilter, setDataFilter] = useState(null);

    function openMenu() {
        setMenu(!menu);
    }

    function openFilter() {
        setFilter(!filter);
    }

    function openModal(id) {
        if (modal) {
        setProductID(null);
        setModal(false);
        }
        setModal(!modal);
    }

    const stylesHomePage = {
        areaFilter: {
        height: "40px",
        backgroundColor: "#FFFFFF",
        display: "flex",
        justifyContent: "end",
        color: "black",
        padding: "10px",
        marginTop: "80px",
        },
    };

    async function fetchData() {
        try {
        const response = await fetch("http://127.0.0.1:8000/ecommerce/");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setData(jsonData);
        } catch (error) {
        console.error("Error fetching data:", error);
        }
    };

    async function getUser() {
        try {
            let token = localStorage.getItem("jwt_access");
            const res = await fetch(`http://127.0.0.1:3342/api/myinfo`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                throw new Error("Failed to fetch user data");
            }
            const data = await res.json();
            setInfo(data);
            setInfoList(
                Object.keys(data.data).map((info_key) => (
                    <li key={info_key}>{data.data[info_key]}</li>
                ))
            );
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }
    

    useEffect(() => {
        fetchData();
        if (!info) {
            getUser();
        }

    }, [data, productID]);

    if (!info) return <p>No profile data</p>;

    return (
        <div className=" bg-white">
        <AnimatePresence>
            {menu ? (
            <div className=" bg-white">
                <Menu openMenu={openMenu} user={info} />
            </div>
            ) : (
            <div className=" bg-white">
                <HeaderPage openMenu={openMenu} user={info}/>
                <div className="overflow-y-auto">
                {filter ? (
                    <div>
                    <Filter
                        openFilter={openFilter}
                        data={data}
                        setDataFilter={setDataFilter}
                    />
                    </div>
                ) : (
                    <div style={stylesHomePage.areaFilter}>
                    <div className="cursor-pointer" onClick={openFilter}>
                        <MdOutlineTune style={{ fontSize: "32px" }} />
                    </div>
                    </div>
                )}
                {dataFilter ? (
                    <ListItem data={data} dataFilter={dataFilter} openModal={openModal} setProductID={setProductID}/>
                    ):(
                    <ListItem data={data} openModal={openModal} setProductID={setProductID}/>
                    )}
                </div>
            </div>
            )}
            {modal && productID && (
                <ShowProduct
                productID={data.find((product) => product.id === productID)}
                openModal={openModal}
                user={info}
                />
            )}
        </AnimatePresence>
        </div>
    );
};

export default Store;
