import React, { useState, useEffect } from "react";
import { Form, Input, message, Modal, Select, Table, DatePicker } from 'antd'
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import Layout from "./../components/Layout/Layout";
import axios from 'axios';
import LoadSpinner from "../components/Layout/LoadSpinner";
import moment from "moment";
import Analytics from "../components/Analytics";
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState('365')
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState('all');
  const [viewData, setViewData] = useState('table');
  const [editable, setEditable] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;


  //table data
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>
    },
    {
      title: 'Amount',
      dataIndex: 'amount'
    },
    {
      title: 'Type',
      dataIndex: 'type'
    },
    {
      title: 'Category',
      dataIndex: 'category'
    },
    {
      title: 'Reference',
      dataIndex: 'reference'
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <div>
          <EditOutlined onClick={() => {
            setEditable(record)
            setShowModal(true)
          }} />
          <DeleteOutlined className="mx-2" onClick={() => deleteHandler(record)} />
        </div>
      )
    }
  ];


  //useEffect hook
  useEffect(() => {
    //getAll transactions
    const getAllTransactions = async () => {
      console.log("API_URL:", API_URL);

      try {
        const user = JSON.parse(localStorage.getItem('user'));
        setLoading(true);
        const res = await axios.post(`${API_URL}transactions/get-transaction`, {
          userid: user._id,
          frequency,
          selectedDate,
          type,
        })
        setAllTransaction(res.data)
        setLoading(false);
        // console.log(res.data)
      } catch (error) {
        console.log(error)
        message.error("Fetch Issue")
      }
    };
    getAllTransactions();
  }, [API_URL, frequency, selectedDate, type, refreshData])

  //delete handler
  const deleteHandler = async (record) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}transactions/delete-transaction`, { transactionId: record._id })
      setAllTransaction(allTransaction.filter(t => t._id !== record._id));
      setLoading(false);
      message.success("Transaction deleted");
      setRefreshData(!refreshData);
    } catch (error) {
      setLoading(false);
      console.log(error)
      message.error("Deletion Failed!!")
    }
  }

  //form handling
  const submitHandler = async (values) => {
    // console.log(values);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      // console.log("hello", values, user);
      setLoading(true);
      if (editable) {
        const res = await axios.post(`${API_URL}transactions/edit-transaction`, {
          payload: {
            ...values,
            userId: user._id,
          },
          transactionId: editable._id,
        })
        console.log("this one-", res);
        setAllTransaction(allTransaction.map(t => t._id === res.data._id ? res.data._id : t));
        setRefreshData(!refreshData);
        setLoading(false);
        message.success('Transaction Updated Successfully')
      }
      else {
        const res = await axios.post(`${API_URL}transactions/add-transaction`, { ...values, userid: user._id });
        // for debug Log response  see the structure of newTransaction
        // console.log("New Transaction Response:", res.data);

        setAllTransaction([...allTransaction, res.data.newTransaction]);
        setRefreshData(!refreshData);
        // console.log('Updated Transactions:', allTransaction);
        setLoading(false);
        message.success('Transaction Added Successfully')
      }
      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      message.error('Failed to add transition')
    }
  };


  return (
    <Layout>

      {loading && <LoadSpinner />}
      <div className="filters">
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values) => { setFrequency(values) }}>
            <Select.Option value="7">
              Last 1 Week
            </Select.Option>
            <Select.Option value="30">
              Last 1 Month
            </Select.Option>
            <Select.Option value="365">
              Last 1 Year
            </Select.Option>
            <Select.Option value="custom">
              Custom
            </Select.Option>
          </Select>
          {frequency === 'custom' && (<RangePicker value={selectedDate} onChange={(values) => { setSelectedDate(values) }} />)}
        </div>
        <div className="filter-tab ">
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => { setType(values) }}>
            <Select.Option value="all">
              All Transactions
            </Select.Option>
            <Select.Option value="income">
              Income
            </Select.Option>
            <Select.Option value="expense">
              Expense
            </Select.Option>
          </Select>
        </div>

        {/* // antd icons */}
        <div className="switch-icons">
          {/* table */}
          <UnorderedListOutlined className={`mx-2 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'}`} onClick={() => setViewData('table')} />

          {/* chart */}
          <AreaChartOutlined className={`mx-2 ${viewData === 'analytics' ? 'active-icon' : 'inactive-icon'}`} onClick={() => setViewData('analytics')} />
        </div>

        <div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add New</button>
        </div>
      </div>
      <div className="content">
        {viewData === 'table' ?
          <Table columns={columns} dataSource={allTransaction} />
          : <Analytics allTransaction={allTransaction} />
        }
      </div>
      <Modal title={editable ? 'Edit Transaction' : 'Add Transaction'} open={showModal} onCancel={() => setShowModal(false)} footer={false} >
        <Form layout="vertical" onFinish={submitHandler} initialValues={editable} >
          <Form.Item label="Amount" name="amount">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Select>
              <Select.Option value="income">
                Income
              </Select.Option>
              <Select.Option value="expense">
                Expense
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="PocketMoney">
                Pocket Money
              </Select.Option>
              <Select.Option value="salary">
                Salary
              </Select.Option>
              <Select.Option value="project">
                Project
              </Select.Option>
              {/* <Select.Option value="other">
                Other
              </Select.Option> */}
              <Select.Option value="fee">
                Fee
              </Select.Option>
              <Select.Option value="food">
                Food
              </Select.Option>
              <Select.Option value="stationary">
                Stationary
              </Select.Option>
              <Select.Option value="medical">
                Medical
              </Select.Option>
              <Select.Option value="other">
                Other
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" required />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary"> {" "}
              SAVE
            </button>
          </div>
        </Form>

      </Modal>
    </Layout>
  );
};

export default HomePage;
