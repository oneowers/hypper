import {Link,useLocation, useNavigate, Outlet} from 'react-router-dom'
import { useState, useEffect } from 'react'
import 'react-loading-skeleton/dist/skeleton.css'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// ...

// Inside the Test component
export default function Test() {
    const [subCategories, setCategories] = useState(null);
    const [tabs, setTabs] = useState([]);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const navigate = useNavigate(); // Access the navigate function from the hook

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_BASE_URL + `/api/categories/`;

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Сетевая ошибка');
                }
                return response.json();
            })
            .then((data) => {
                setCategories(data);
            })
            .catch((error) => {
                console.error('!!! Ошибка', error);
            });
    }, []);

    useEffect(() => {
        const initialTabs = [
        ];

        if (subCategories) {
            const categoryTabs = subCategories.map((category) => ({
                name: category.name,
                onClick: () => handleCategoryClick(category.id),
                current: category.id === currentCategoryId,
            }));

            setTabs([...initialTabs, ...categoryTabs]);
        } else {
            setTabs(initialTabs);
        }
    }, [subCategories, currentCategoryId]);

    // Handler for category click
    const handleCategoryClick = (categoryId) => {
        // Update the URL
        navigate(`/test?data=${encodeURIComponent(JSON.stringify({ category_id: categoryId }))}`);

        // Fetch products based on the new category ID
        fetchProducts(categoryId);

        // Update the currentCategoryId state
        setCurrentCategoryId(categoryId);
    };

    // Function to fetch products based on category ID
    const fetchProducts = (categoryId) => {
        const apiUrl = process.env.REACT_APP_API_BASE_URL + `/api/products/?category_id=${categoryId}`;

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                // Handle the fetched data, update state, etc.
            })
            .catch((error) => {
                console.error('Error fetching product:', error);
            });
    };


    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const rawData = searchParams.get('data');
        const decodedData = JSON.parse(decodeURIComponent(rawData));
        const categoryId = decodedData.category_id;

        const apiUrl = process.env.REACT_APP_API_BASE_URL + `/api/products/?category_id=${categoryId}`;

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data.results);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching product:', error);
                setLoading(false);
            });
    }, [window.location.search]); // Watch for changes in the URL's search parameters

    return (
        <div className="lg:col-span-3">
            <div className="sm:flex sm:items-baseline">
                <div className="my-4 sm:mt-0">
                    <nav className="-mb-px flex space-x-3">
                        {tabs.map((tab) => (
                            <div
                                key={tab.name}
                                onClick={tab.onClick} // Attach the onClick handler
                                className={classNames(
                                    tab.current
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700',
                                    'whitespace-nowrap px-4 py-2 text-sm font-medium  rounded-full'
                                )}
                            >
                                {tab.name}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
            <>
                {loading ? (
                    <>Loading..</>
                ) : (
                    <>
                        {products.map((product) => (
                            <>{product.name}</>
                        ))}
                    </>
                )}
            </>
        </div>
    );
}
