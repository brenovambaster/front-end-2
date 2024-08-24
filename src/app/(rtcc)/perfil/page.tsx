import React from 'react';

const UserProfile: React.FC = () => {
    return (
        <div className="flex flex-col items-center min-h-screen bg-blue-100 p-6">
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg p-6 w-full max-w-5xl">
                {/* Sidebar */}
                <div className="flex flex-col items-center md:w-1/3 p-4 border-r">
                    <img
                        src="https://via.placeholder.com/150"
                        alt="Profile"
                        className="w-32 h-32 rounded-full mb-4"
                    />
                    <h2 className="text-lg font-bold">Nathaniel Poole</h2>
                    <p className="text-gray-600">Microsoft Inc.</p>

                    <div className="mt-4 w-full">
                        <div className="flex justify-between mb-2 text-gray-700">
                            <span>Opportunities applied</span>
                            <span className="text-orange-500 font-bold">32</span>
                        </div>
                        <div className="flex justify-between mb-2 text-gray-700">
                            <span>Opportunities won</span>
                            <span className="text-green-500 font-bold">26</span>
                        </div>
                        <div className="flex justify-between mb-4 text-gray-700">
                            <span>Current opportunities</span>
                            <span className="text-blue-500 font-bold">6</span>
                        </div>
                        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600">
                            View Public Profile
                        </button>
                        <a href="#" className="block text-blue-500 mt-2 text-center">
                            https://app.ahiregro...
                        </a>
                    </div>
                </div>

                {/* Profile Settings */}
                <div className="flex-1 p-6">
                    <div className="flex border-b pb-2 mb-4">
                        <h3 className="text-xl font-semibold mr-8">Account Settings</h3>
                        <h3 className="text-gray-500 mr-8">Company Settings</h3>
                        <h3 className="text-gray-500 mr-8">Documents</h3>
                        <h3 className="text-gray-500 mr-8">Billing</h3>
                        <h3 className="text-gray-500">Notifications</h3>
                    </div>

                    <form>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">First Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value="Nathaniel"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value="Poole"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value="+1800-000"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Email address</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value="nathaniel.poole@microsoft.com"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">City</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value="Bridgeport"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">State/County</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value="WA"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Postcode</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value="31005"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Country</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value="United States"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                        >
                            Update
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
