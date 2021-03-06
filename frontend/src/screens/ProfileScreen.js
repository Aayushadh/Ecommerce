import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { getMyOrders } from '../actions/orderActions'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

const ProfileScreen = ({ location, history }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const dispatch = useDispatch()

    const userDetails = useSelector((state) => state.userDetails)
    const { loading, error, user } = userDetails

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const myOrderList = useSelector((state) => state.myOrderList)
    const {
        loading: loadingMyOrders,
        error: errorMyOrders,
        orders,
    } = myOrderList

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
    const { success } = userUpdateProfile
    console.log('success' + success)

    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        } else {
            if (!user.name) {
                dispatch(getUserDetails('profile'))
                dispatch(getMyOrders())
            } else {
                if (user.email !== userInfo.email) {
                    dispatch(getUserDetails('profile'))
                    dispatch(getMyOrders())
                }
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [userInfo, history, user.name, user.email, dispatch])

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage("Password doesn't match")
        } else {
            dispatch(updateUserProfile({ id: user._id, name, email, password }))
        }
    }

    return (
        <Row>
            <Col md={3}>
                <h2>USER PROFILE</h2>
                {error && <Message variant="danger">{error}</Message>}
                {success && (
                    <Message variant="success">Updated Successfully</Message>
                )}
                {message && <Message variant="danger">{message}</Message>}
                {loading ? (
                    <Loader />
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="name"
                                placeholder="Enter Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            ></Form.Control>
                        </Form.Group>

                        <Button type="submit" variant="primary">
                            Update
                        </Button>
                    </Form>
                )}
            </Col>
            <Col md={9}>
                <h2>MY ORDER</h2>
                {loadingMyOrders ? (
                    <Loader />
                ) : errorMyOrders ? (
                    <Message variant="danger">{errorMyOrders}</Message>
                ) : (
                    <Table
                        striped
                        bordered
                        hover
                        responsive
                        className="table-sm"
                    >
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>${order.totalPrice}</td>
                                    <td>
                                        {order.isPaid ? (
                                            order.paidAt.substring(0, 10)
                                        ) : (
                                            <i
                                                className="fas fa-times"
                                                style={{ color: 'red' }}
                                            ></i>
                                        )}
                                    </td>
                                    <td>
                                        {order.isDelieverd ? (
                                            order.deliveredAt.substring(0, 10)
                                        ) : (
                                            // <Loader type="Circles" color="red" height={80} width={80}/>
                                            <i
                                                className="fas fa-times"
                                                style={{ color: 'red' }}
                                            ></i>
                                        )}
                                    </td>
                                    <td>
                                        <LinkContainer
                                            to={`/order/${order._id}`}
                                        >
                                            <Button
                                                className="btn-sm"
                                                variant="light"
                                            >
                                                Details
                                            </Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    )
}

export default ProfileScreen
