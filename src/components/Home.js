// import logo from './logo.svg';
import './../App.css';
import DataTable from 'react-data-table-component';
import { useEffect, useState, useCallback } from 'react';
import React, { useMemo } from 'react';
import { Link } from "react-router-dom"


function Home() {
    const [data, setData] = useState(null);
    const [datafilter, setDataFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isLogged = window.sessionStorage.getItem("token");
    const username = window.sessionStorage.getItem("username");

    // Get Data From API
    const fetchDataForPosts = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/ship`);
            if (!response.ok) {
                throw new Error(`HTTP error: Status ${response.status}`);
            }
            const postsData = await response.json();
            setData(postsData.data[0]);
            setDataFilter(postsData.data[0]);
            setError(null);
        } catch (err) {
            setError(err.message);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchDataForPosts();
    }, []);

    const HeaderColumns =
        [
            {
                name: 'ProductID',
                selector: row => row.ProductID
            },
            {
                name: 'ProductName',
                selector: row => row.ProductName
            },
            {
                name: 'ProductImage',
                selector: row => <img src={row.ProductImage} alt={row.ProductName} style={{ width: '50px', height: '50px' }} />
            },
            {
                name: 'ProductPrice',
                selector: row => row.ProductPrice + "฿"
            },
            {
                cell: (row) => <Link to={`/productDetail/${row.ProductID}`}>Details</Link>,
                ignoreRowClick: true,
                allowOverflow: true,
                button: true,
            },
        ];
    const datas = []

    // set state เปิด-ปิด form
    const [statusAdd, setStatusAdd] = useState(false);
    function handleFilter(event) {
        const newData = datafilter.filter(row => {
            return row.CompanyName.toLowerCase().includes(event.target.value.toLowerCase())
        })
        setData(newData)
    }
    function handleLogout(){
        sessionStorage.clear();
        window.location.reload();
    }
    function handleClickAdd(event) {
        setStatusAdd(true)
    }
    function handleClickCloseForm(event) {
        setStatusAdd(false)
    }
    const [formValue, setFormValue] = useState({ ProductName: '', ProductImage: '', ProductDetail: '', ProductPrice: '', ProductSize: '', ProductMaterial: '' })
    const handlePostShip = (e) => {
        const { name, value } = e.target;
        setFormValue({ ...formValue, [name]: value });
    }
    // กด submit post data
    const handleSubmit = async (e) => {
        e.preventDefault();
        const allInputValue = { ProductName: formValue.ProductName, ProductImage: formValue.ProductImage, ProductDetail: formValue.ProductDetail, ProductPrice: formValue.ProductPrice, ProductSize: formValue.ProductSize, ProductMaterial: formValue.ProductMaterial, token: isLogged }
        console.log(allInputValue)

        let res = await fetch("http://localhost:8080/api/ship", {
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(allInputValue)
        })

        let resjson = await res.json();
        if (res.status === 200) {
            setStatusAdd(false)
            fetchDataForPosts();
            return (
                alert('Yes')

            );
        } else {
            return (
                alert('No')
            );
        }

    }

    // handle Del From DataBase
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);
    const handleRowSelected = React.useCallback(state => {
        setSelectedRows(state.selectedRows);
        console.log(state.selectedRows)
        console.log(selectedRows)
        console.log(setSelectedRows)
    }, []);

    const contextActions = React.useMemo(() => {

        //กด delete
        const handleDelete = (id) => {

            if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.CompanyName)}?`)) {
                setToggleCleared(!toggleCleared);
                console.log(selectedRows)

                const shipperIDs = selectedRows.map(item => item.ShipperID);
                shipperIDs.forEach(shipperID => {
                    fetch(`http://localhost:8080/api/ship/${shipperID}`, {
                        method: "DELETE",
                        headers: { 'content-type': 'application/json' },
                    })
                        .then(res => {
                            if (res.status === 200) {
                                setStatusAdd(false);
                                fetchDataForPosts();
                                console.log(`ShipperID ${shipperID} deleted successfully`);
                            } else {
                                console.error(`Failed to delete ShipperID ${shipperID}`);
                            }
                        })
                        .catch(error => {
                            console.error(`Error deleting ShipperID ${shipperID}:`, error);
                        });
                });

                // Optionally, you can show a confirmation message here after all requests are completed
                alert('Delete requests sent for selected rows');
            }

        };

        return (
            <button key="delete" onClick={handleDelete} style={{ backgroundColor: 'red' }}>
                Delete
            </button>
        );
    }, [data, selectedRows, toggleCleared]);


    return (
        <div className='container'>
            { (username != null || username != undefined) &&
            <div style={{ alignSelf: 'right', display: 'flex', gap: '0.5rem' }}>
                    Hello {username}
            </div>}
            <div style={{ alignSelf: 'right', display: 'flex', gap: '0.5rem' }}>

                {(isLogged == null || isLogged == undefined) &&
                <div>
                    <Link style={{ margin: '0 0.5rem 0 0.5rem', textAlign: 'right' }} to={`/login`}>Login</Link>
                </div>}

                {(isLogged != null || isLogged != undefined) &&
                <div>
                    <button style={{ margin: '0 0.5rem 0 0.5rem', textAlign: 'right' }} onClick={handleLogout} >Logout</button>
                </div>}

                {statusAdd == false && (isLogged != null || isLogged != undefined) &&
                    <div>
                        <button onClick={handleClickAdd}>Add Product +</button>
                    </div>}

                {statusAdd == true && <button onClick={handleClickCloseForm}>X</button>}

            </div>
            {statusAdd == false &&
                <div>
                    <DataTable
                        theme="default"
                        title="Product Data"
                        columns={HeaderColumns}
                        selectableRows
                        contextActions={contextActions}
                        onSelectedRowsChange={handleRowSelected}
                        clearSelectedRows={toggleCleared}
                        data={data || datas}
                    />
                </div>}

            {statusAdd == true &&
                <div>
                    <form
                        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}
                        onSubmit={handleSubmit}
                        method="POST"
                    >
                        <div><h4>เพิ่มข้อมูล</h4></div>
                        <div>
                            <input
                                type="text"
                                placeholder="ProductName"
                                name="ProductName"
                                value={formValue.ProductName}
                                onChange={handlePostShip}

                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="ProductImage"
                                name="ProductImage"
                                value={formValue.ProductImage}
                                onChange={handlePostShip}

                            />
                        </div>
                        <div >
                            <input
                                type="number"
                                placeholder="ProductPrice"
                                name="ProductPrice"
                                value={formValue.ProductPrice}
                                onChange={handlePostShip}

                            />
                        </div>
                        <div >
                            <input
                                type="text"
                                placeholder="ProductDetail"
                                name="ProductDetail"
                                value={formValue.ProductDetail}
                                onChange={handlePostShip}

                            />
                        </div>
                        <div >
                            <input
                                type="text"
                                placeholder="ProductSize"
                                name="ProductSize"
                                value={formValue.ProductSize}
                                onChange={handlePostShip}

                            />
                        </div>
                        <div >
                            <input
                                type="text"
                                placeholder="ProductMaterial"
                                name="ProductMaterial"
                                value={formValue.ProductMaterial}
                                onChange={handlePostShip}

                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                            >
                                submit
                            </button>
                        </div>

                    </form>
                </div>}

        </div>
    );
}

export default Home;