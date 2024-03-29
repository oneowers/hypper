import {useParams, Link, Outlet, useNavigate} from 'react-router-dom'
import React, {Fragment, useState, useEffect} from 'react'
import {Dialog, Disclosure, Menu, Transition} from '@headlessui/react'
import {XMarkIcon} from '@heroicons/react/24/outline'
import {ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon, StarIcon} from '@heroicons/react/20/solid'
import Cookies from 'js-cookie';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const sortOptions = [
    {name: 'Most Popular', href: '#', current: true},
    {name: 'Best Rating', href: '#', current: false},
    {name: 'Newest', href: '#', current: false},
    {name: 'Price: Low to High', href: '#', current: false},
    {name: 'Price: High to Low', href: '#', current: false},
]

const filters = [
    {
        id: 'color',
        name: 'Color',
        options: [
            {value: 'white', label: 'White', checked: false},
            {value: 'beige', label: 'Beige', checked: false},
            {value: 'blue', label: 'Blue', checked: true},
            {value: 'brown', label: 'Brown', checked: false},
            {value: 'green', label: 'Green', checked: false},
            {value: 'purple', label: 'Purple', checked: false},
        ],
    },
    {
        id: 'category',
        name: 'Category',
        options: [
            {value: 'new-arrivals', label: 'New Arrivals', checked: false},
            {value: 'sale', label: 'Sale', checked: false},
            {value: 'travel', label: 'Travel', checked: true},
            {value: 'organization', label: 'Organization', checked: false},
            {value: 'accessories', label: 'Accessories', checked: false},
        ],
    },
    {
        id: 'size',
        name: 'Size',
        options: [
            {value: '2l', label: '2L', checked: false},
            {value: '6l', label: '6L', checked: false},
            {value: '12l', label: '12L', checked: false},
            {value: '18l', label: '18L', checked: false},
            {value: '20l', label: '20L', checked: false},
            {value: '40l', label: '40L', checked: true},
        ],
    },
]


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


function formatPrice(price) {
    if (price == null) return 0
    const priceString = price.toString();
    const parts = priceString.split('.');
    const formattedPrice = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    if (parts[1]) {
        return `${formattedPrice}.${parts[1]}`;
    } else {
        return formattedPrice;
    }
}


export default function Example() {
    const [subCategories, setCategories] = useState(null);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [tabs, setTabs] = useState([]);
    const [coins, setCoins] = useState(0);
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);

    const searchParams = new URLSearchParams(window.location.search);
    const rawData = searchParams.get('data');
    const decodedData = JSON.parse(decodeURIComponent(rawData));
    console.log(decodedData)


    const addToCard = async (productId) => {

        const cookieValue = Cookies.get('user_id');

        if (cookieValue !== undefined) {
        // Assuming you have the user ID, product ID, and other required data
            const userId = cookieValue;
        
            // Create a cart item object based on the product data
            const cartItem = {
                product: productId,
            };
        
            try {
                const response = await fetch(`/api/user/${userId}/cartitems/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify([cartItem]),
                });
        
                if (response.ok) {
                    alert("Product added to cart successfully!");
                    // ... Add any additional logic after successful addition to the cart
                } else {
                    // Handle error cases
                    alert("Failed to add product to cart. Please try again.");
                }
            } catch (error) {
                console.error("Error adding product to cart:", error);
            }
        }
    };
    

    const myArray = [1, 2, 3, 4];

    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const navigate = useNavigate();

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
        if (subCategories) {
            const categoryTabs = subCategories.map((category) => ({
                id: category.id,
                name: category.name,
                onClick: () => handleCategoryClick(category.id),
                current: category.id === currentCategoryId,
            }));
            setTabs(categoryTabs);
        }
    }, [subCategories, currentCategoryId]);

    // Updated handleCategoryClick
    const handleCategoryClick = (categoryId) => {
        const category_id = categoryId != null ? categoryId : ''; // If categoryId is null, use an empty string
        navigate(`/products?data=${encodeURIComponent(JSON.stringify({ category_id }))}`);
        fetchProducts(categoryId);
        setCurrentCategoryId(categoryId);
    };

// Updated fetchProducts
const fetchProducts = (categoryId) => {
const apiUrl = categoryId
    ? process.env.REACT_APP_API_BASE_URL + `/api/products/?category_id=${categoryId}`
    : process.env.REACT_APP_API_BASE_URL + '/api/products/';

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
};


    // ... (other imports and component code)

useEffect(() => {

    const apiUrl = decodedData != null
        ? process.env.REACT_APP_API_BASE_URL + `/api/products/?category_id=${decodedData.category_id}`
        : process.env.REACT_APP_API_BASE_URL + '/api/products/';

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
}, [window.location.search]);



    if (!subCategories && !decodedData) {
        return (
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-10">
                    <Skeleton className="px-80 p-3"/>
                </div>
                <section aria-labelledby="products-heading" className="pb-24 pt-6">
                    <h2 id="products-heading" className="sr-only">
                        Products
                    </h2>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">

                        <div className="hidden lg:block">
                            <Skeleton count={10} className="p-2 m-2 mt-3"/>
                        </div>

                        <div className="lg:col-span-3">
                            <div className="-mx-px grid grid-cols-2 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
                                {myArray.map(() => (
                                    <div
                                        className="aspect-h-1 m-3 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-90">
                                        <Skeleton className="h-80 w-52"/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        )
    }


   

    return (
        <div className="bg-white">
            <div>
                {/* Mobile filter dialog */}
                <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
                        <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300"
                                          enterFrom="opacity-0" enterTo="opacity-100"
                                          leave="transition-opacity ease-linear duration-300"
                                          leaveFrom="opacity-100" leaveTo="opacity-0">
                            <div className="fixed inset-0 bg-black bg-opacity-25"/>
                        </Transition.Child>

                        <div className="fixed inset-0 z-40 flex">
                            <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform"
                                              enterFrom="translate-x-full" enterTo="translate-x-0"
                                              leave="transition ease-in-out duration-300 transform"
                                              leaveFrom="translate-x-0"
                                              leaveTo="translate-x-full">
                                <Dialog.Panel
                                    className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                                    <div className="flex items-center justify-between px-4">
                                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                        <button type="button"
                                                className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                                                onClick={() => setMobileFiltersOpen(false)}
                                        >
                                            <span className="sr-only">Close menu</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true"/>
                                        </button>
                                    </div>

                                    {/* Filters */}
                                    <form className="mt-4 border-t border-gray-200">
                                        <h3 className="sr-only">Categories</h3>

                                        {filters.map((section) => (
                                            <Disclosure as="div" key={section.id}
                                                        className="border-t border-gray-200 px-4 py-6">
                                                {({open}) => (
                                                    <>
                                                        <h3 className="-mx-2 -my-3 flow-root">
                                                            <Disclosure.Button
                                                                className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                                                <span
                                                                    className="font-medium text-gray-900">{section.name}</span>
                                                                <span className="ml-6 flex items-center">
                                                    {open ? (
                                                        <MinusIcon className="h-5 w-5" aria-hidden="true"/>
                                                    ) : (
                                                        <PlusIcon className="h-5 w-5" aria-hidden="true"/>
                                                    )}
                                                </span>
                                                            </Disclosure.Button>
                                                        </h3>
                                                        <Disclosure.Panel className="pt-6">
                                                            <div className="space-y-6">
                                                                {section.options.map((option, optionIdx) => (
                                                                    <div key={option.value}
                                                                         className="flex items-center">
                                                                        <input
                                                                            id={`filter-mobile-${section.id}-${optionIdx}`}
                                                                            name={`${section.id}[]`}
                                                                            defaultValue={option.value}
                                                                            type="checkbox"
                                                                            defaultChecked={option.checked}
                                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                                                                        <label
                                                                            htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                                                            className="ml-3 min-w-0 flex-1 text-gray-500">
                                                                            {option.label}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </Disclosure.Panel>
                                                    </>
                                                )}
                                            </Disclosure>
                                        ))}
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-10">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">New Arrivals</h1>

                        <div className="flex items-center">
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <Menu.Button
                                        className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                        Sort
                                        <ChevronDownIcon
                                            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                            aria-hidden="true"/>
                                    </Menu.Button>
                                </div>

                                <Transition as={Fragment} enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95">
                                    <Menu.Items
                                        className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            {sortOptions.map((option) => (
                                                <Menu.Item key={option.name}>
                                                    {({active}) => (
                                                        <a href={option.href} className={classNames(option.current
                                                            ? 'font-medium text-gray-900' : 'text-gray-500', active ? 'bg-gray-100'
                                                            : '', 'block px-4 py-2 text-sm')}>
                                                            {option.name}
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            ))}
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>

                            <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                                <span className="sr-only">View grid</span>
                                <Squares2X2Icon className="h-5 w-5" aria-hidden="true"/>
                            </button>
                            <button type="button"
                                    className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                                    onClick={() => setMobileFiltersOpen(true)}
                            >
                                <span className="sr-only">Filters</span>
                                <FunnelIcon className="h-5 w-5" aria-hidden="true"/>
                            </button>
                        </div>
                    </div>

                    <section aria-labelledby="products-heading" className="pb-24 pt-6">
                        <h2 id="products-heading" className="sr-only">
                            Products
                        </h2>

                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                            {/* Filters */}
                            <form className="hidden lg:block">
                                <h3 className="sr-only">Categories</h3>

                                {filters.map((section) => (
                                    <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
                                        {({open}) => (
                                            <>
                                                <h3 className="-my-3 flow-root">
                                                    <Disclosure.Button
                                                        className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                                        <span
                                                            className="font-medium text-gray-900">{section.name}</span>
                                                        <span className="ml-6 flex items-center">
                                            {open ? (
                                                <MinusIcon className="h-5 w-5" aria-hidden="true"/>
                                            ) : (
                                                <PlusIcon className="h-5 w-5" aria-hidden="true"/>
                                            )}
                                        </span>
                                                    </Disclosure.Button>
                                                </h3>
                                                <Disclosure.Panel className="pt-6">
                                                    <div className="space-y-4">
                                                        {section.options.map((option, optionIdx) => (
                                                            <div key={option.value} className="flex items-center">
                                                                <input id={`filter-${section.id}-${optionIdx}`}
                                                                       name={`${section.id}[]`}
                                                                       defaultValue={option.value} type="checkbox"
                                                                       defaultChecked={option.checked}
                                                                       className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                                                                <label htmlFor={`filter-${section.id}-${optionIdx}`}
                                                                       className="ml-3 text-sm text-gray-600">
                                                                    {option.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                ))}
                            </form>

                            {/* Product grid */}
                            <div className="lg:col-span-3">

                                {/* tabs start */}
<div className="sm:flex sm:items-baseline">
    <div className="my-4 sm:mt-0">
        <nav className="-mb-px flex space-x-3">
            <div
                onClick={() => handleCategoryClick(null)} // Pass null or any identifier for "All"
                className={classNames(
                    decodedData == null
                        ? 'bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/50'
                        : decodedData.category_id == "" ? 'bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/50' :'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 ',
                    'px-4 select-none py-2 text-sm rounded-full cursor-pointer rounded-full cursor-pointer relative  flex items-center text-sm font-medium transition-colors duration-200 ease-out'
                )}
            >
                All
            </div>
            {tabs.map((tab, index) => (
                <div
                    key={tab.name}
                    onClick={tab.onClick}
                    className={classNames(
                        tab.id === (decodedData != null ? decodedData.category_id : -1)
                            ? 'bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/50'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700',
                        'px-4 select-none py-2 text-sm rounded-full cursor-pointer rounded-full cursor-pointer relative  flex items-center text-sm font-medium transition-colors duration-200 ease-out'
                    )}
                >
                    {tab.name}
                </div>
            ))}
        </nav>
    </div>
</div>
{/* tabs end */}



                                <div className="bg-white">
                                    <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-0">
                                        <h2 className="sr-only">Products</h2>
                                        <div className="-mx-px grid grid-cols-2 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
                                            {!loading ? products.map((product) => (product.is_published ? (
                                                        <div key={product.id} className="group p-1 sm:p-2 fade-in">
                                                            <div
                                                                className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200
                                                                ">
                                                                <Link to={"/product/" + product.id}>
                                                                    <img src={product.image} alt={product.image}
                                                                         className="w-full h-60 object-cover bg-center"/>
                                                                </Link>
                                                            </div>
                                                            <div className="pb-4 pt-5">
                                                                <h3 className="text-base text-gray-900">
                                                                    <Link to={"/product/" + product.id}>
                                                                        {product.name}
                                                                        <span className="placeholder col-6"></span>
                                                                    </Link>
                                                                </h3>
                                                                
                                                                <h4 className="text-sm text-blue-800">
                                                                    <Link to={"/seller/" + product.seller.id}>
                                                                        {product.seller.store_name}
                                                                    </Link>
                                                                </h4>
                                                                <div className="flex items-center mt-2">
                                                                    <StarIcon
                                                                        className={'text-yellow-400 h-4 w-4 flex-shrink-0'}
                                                                        aria-hidden="true"/>
                                                                    <p className="ml-1 text-sm text-gray-500">{product.rating} out
                                                                        of 5 stars</p>
                                                                </div>

                                                                <div className="mt-2">
                                                                    <div
                                                                        className="flex flex-wrap items-center justify-between">
                                                                        <div>
                                                                            {product.discount_price != 0 ? (
                                                                                <>
                                                                                    <del
                                                                                        className="mt-1 text-sm text-gray-400 ">{formatPrice(product.price)}
                                                                                        сум
                                                                                    </del>
                                                                                    <h4 className="text-lg text-lg font-bold text-gray-700 ">
                                                                                        {formatPrice(product.discount_price)} сум</h4>
                                                                                </>
                                                                            ) : (
                                                                                <h4 className="text-lg text-lg font-bold text-gray-700 ">
                                                                                    {formatPrice(product.price)} сум</h4>
                                                                            )}
                                                                        </div>
                                                                        <div className="ml-4 flex-shrink-0">
                                                                            <button onClick={() => addToCard(product.id)}
                                                                                    className="right-0 bottom-0 w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-900 hover:bg-gray-100">
                                                                                <i className="fa fa-shopping-cart text-gray-600"
                                                                                   aria-hidden="true"></i>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="aspect-h-1 m-2 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-90">
                                                            <Skeleton className="h-80 w-52"/>
                                                        </div>
                                                    )
                                                )
                                            ) :
                                                myArray.map(() => (
                                                    <div className="aspect-h-1 m-3 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-90">
                                                        <Skeleton className="h-80 w-52"/>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
