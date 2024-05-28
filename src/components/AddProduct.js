import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';

function AddProduct() {
    const [formValue, setFormValue] = useState({ Username: '', Password: '' })
    const handlePostShip = (e) => {
        const { name, value } = e.target;
        setFormValue({ ...formValue, [name]: value });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const allInputValue = { CompanyName: formValue.CompanyName, Phone: formValue.Phone }
        console.log(allInputValue)

        let res = await fetch("http://localhost:8080/api/ship", {
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(allInputValue)
        })

        let resjson = await res.json();
        if (res.status === 200) {
            // setStatusAdd(false)
            // fetchDataForPosts();
            return (
                alert('Yes')

            );
        } else {
            return (
                alert('No')
            );
        }

    }

    return (
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
                        placeholder="CompanyName"
                        name="CompanyName"
                        value={formValue.CompanyName}
                        onChange={handlePostShip}

                    />
                </div>
                <div >
                    <input
                        type="text"
                        placeholder="Phone"
                        name="Phone"
                        value={formValue.Phone}
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
        </div>

    )
}

export default AddProduct;