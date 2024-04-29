import React, { useState, useEffect } from "react";

    export default function ListItem(props) {
    const { data, openModal, dataFilter } = props;
    const [products, setProducts] = useState();

    useEffect(() => {
        if (!dataFilter) {
        if (data && data.length > 0) {
            // ตรวจสอบว่า data มีค่าและไม่ใช่ array ว่าง
            // สร้างคัดลอกของข้อมูลเพื่อไม่ทำให้ข้อมูลต้นฉบับเปลี่ยนแปลง
            const sortedData = [...data];
            // เรียงลำดับข้อมูลตามชื่อสินค้า
            sortedData.sort((a, b) => a.name.localeCompare(b.name));
            // ตั้งค่าข้อมูลใหม่ที่เรียงลำดับแล้ว
            setProducts(sortedData);
        }
        } else {
        let filteredData = data; // ใช้ data เป็นค่าเริ่มต้น
        if (dataFilter) {
            filteredData = data.filter((item) => item.type === dataFilter); // กรองข้อมูลโดยใช้ dataFilter
        }

        if (filteredData && filteredData.length > 0) {
            // สร้างคัดลอกของข้อมูลเพื่อไม่ทำให้ข้อมูลต้นฉบับเปลี่ยนแปลง
            const sortedData = [...filteredData];
            // เรียงลำดับข้อมูลตามชื่อสินค้า
            sortedData.sort((a, b) => a.name.localeCompare(b.name));
            // ตั้งค่าข้อมูลใหม่ที่เรียงลำดับแล้ว
            setProducts(sortedData);
        }
        }
    }, [data, dataFilter]);

    return (
        <div className="bg-white text-black h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2 pb-4">
        {products ? (
            <>
            {products.map((item, index) => (
                <div
                key={index}
                className=" p-2 rounded-lg shadow-md cursor-pointer justify-between"
                onClick={() => {
                    props.setProductID(item.id);
                    openModal();
                }}
                style={{ display: "flex", flexDirection: "column" }} // Removed unnecessary justification
                >
                <div className="w-full aspect-square overflow-hidden rounded-lg mb-4">
                    <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    />
                </div>
                <div className="flex justify-between p-1">
                    <h2 className="text-xl font-bold mb-2">{item.name}</h2>
                    <p className="bg-green-400 p-2 h-10 rounded-lg">Stork</p>
                </div>
                <div>
                    <p className="text-gray-700 mb-2">
                    {new Intl.NumberFormat("th-TH", {
                        style: "currency",
                        currency: "THB",
                    }).format(item.price)}
                    </p>
                </div>
                </div>
            ))}{" "}
            </>
        ) : (
            <>
            <h1>Loading</h1>
            </>
        )}
        </div>
    </div>
    );
}
