import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';
import { format, max } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

function Dashboard() {
    const [latestMetrics, setLatestMetrics] = useState([]);
    const [timeSeries, setTimeSeries] = useState([]);
    const [aggregatedMetrics, setAggregatedMetrics] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [aggregationType, setAggregationType] = useState('avg');
    const [metrics, setMetrics] = useState([]); 
    const [categories, setcategories] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const options = {
        maintainAspectRatio: false, 
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 20,
                    color: 'rgb(75, 192, 192)',
                    font: {
                        size: 14
                    }
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0,0,0,0.7)',
                bodyColor: '#fff',
                titleColor: '#fff',
                
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#555', // Changes the color of x-axis labels
                    font: {
                        size: 12
                    }
                },
                grid: {
                    display: false // Removes the grid lines from the x-axis
                }
            },
            y: {
                ticks: {
                    color: '#555', // Changes the color of y-axis labels
                    font: {
                        size: 12
                    }
                },
                grid: {
                    color: '#ddd', // Style or remove grid lines if needed
                }
            }
        }, 
        onClick: (event, elements, chart) => {
            if (elements.length > 0) {
                const dataIndex = elements[0].index;
                const dataPoint = chart.data.datasets[0].data[dataIndex];

                fetchMetricsForDay(dataPoint.x);}}
    };

    useEffect(() => {
        fetchLatestMetrics();
        fetchcategories();
        fetchTimeSeries(selectedCategory, startDate, endDate);
        fetchAggregatedMetrics(selectedCategory, aggregationType, startDate, endDate);
    }, [selectedCategory, aggregationType, startDate, endDate]);

    const fetchMetricsForDay = (date) => {

        const formattedDate = format(date, 'yyyy-MM-dd');

        axios.get(`http://127.0.0.1:8000/api/v1/metrics/?date=${formattedDate}`)
            .then(response => {
                console.log("Metrics for the day:", response.data);
                setMetrics(response.data);
  
            })
            .catch(error => {
                console.error("Error fetching data for the day:", error);
            });
    };

    const fetchcategories = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/v1/categories/');
            setcategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchLatestMetrics = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/v1/latest_metrics/');
            setLatestMetrics(response.data);
        } catch (error) {
            console.error('Error fetching latest metrics:', error);
        }
    };

    const fetchTimeSeries = async (category, startDate, endDate) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/v1/time_series/?category=${category}&start_date=${startDate}&end_date=${endDate}`);
            setTimeSeries(response.data);
        } catch (error) {
            console.error('Error fetching time series:', error);
        }
    };

    const fetchAggregatedMetrics = async (category, operation, startDate, endDate) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/v1/aggregated_metrics/?category=${category}&start_date=${startDate}&end_date=${endDate}&operation=${operation}`);
            setAggregatedMetrics(response.data[0]);
            console.log(1);
        } catch (error) {
            console.error('Error fetching aggregated metrics:', error);
        }
    };

    const timeSeriesData = {
        labels: timeSeries.map(data => new Date(data.envi_time_stamp).toLocaleDateString('en-US', { timeZone: 'UTC' })),
        datasets: [{
            label: selectedCategory,

            data: timeSeries.map(data => {
                return {
                    x: new Date(data.envi_time_stamp).toLocaleDateString('en-US', { timeZone: 'UTC' }),
                    y: data.value,
                    metric: data.category.category_metric 
                };
            }),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            parsing: {
                yAxisKey: 'y' 
            }
        }]
    };

    const metrics_data = {
        labels: metrics.map(item => item.category.category_name),
        datasets: [
            {
                label: 'Metrics',
                data: metrics.map(item => item.value),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
                maxBarThickness: 20,
            }
        ]
    };

    const bar_options = {
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                enabled: true,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                min: 0, // Or any other minimum value you want to set
                ticks: {
                    stepSize: 1, // Adjust the step size as needed
                }
            },
            x: {
                ticks: {
                    color: '#555',
                    font: {
                        size: 8 // Reduced font size for x-axis labels
                    }
                },
                grid: {
                    display: false
                }
            }
        }
    };
    
    

    return (
        <div>
        <h1>Generic Food Processing Company</h1>
        <div className="dashboard-content">

            <div className="metrics-table">

                <table className='latest_metric_table'>
                    <caption>Latest metrics</caption>
                    <thead>
                        <tr>
                            <th>Metric Name</th>
                            <th>Metric Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {latestMetrics.map(metric => (
                            <tr key={metric.id}>
                                <td>{metric.category.category_name}</td>
                                <td>{metric.value.toString() + ' ' + metric.category.category_metric}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {metrics_data && (
                <div className="metrics-chart">
                    <Bar data={metrics_data} options={bar_options} />
                </div>
                    )}
        </div>
    <div className="chart-box">
    <div className="chart-container">
        <div className="time-series-container">
            <h2>Category Time Series</h2>
            <div className='button-container'>
                <select onChange={e => setSelectedCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.category_id} value={category.category_name}>
                            {category.category_name}
                        </option>
                    ))}
                </select>
                <div>
                    <label htmlFor="start-date">Start Date</label>
                    <input
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="end-date">End Date</label>
                    <input
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                    />
                </div>
            </div>
            <Line data={timeSeriesData} options={options} />
        </div>
        </div>
        </div>
        </div>
    );
}

export default Dashboard;
