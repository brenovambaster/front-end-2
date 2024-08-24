import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'tailwindcss/tailwind.css';

const UserProfile = () => {
    return (
        <div className="flex p-6">
            {/* Left Container */}
            <div className="w-1/4 p-4 bg-white shadow rounded-lg">
                <div className="text-center">
                    <img
                        src="https://via.placeholder.com/100"
                        alt="User Profile"
                        className="rounded-full mx-auto"
                    />
                    <h2 className="mt-4 text-xl font-semibold">Nathaniel Poole</h2>
                    <p className="text-gray-600">Microsoft Inc.</p>
                </div>
                <div className="mt-6 space-y-2">
                    <div className="flex justify-between">
                        <span>Opportunities applied</span>
                        <span className="text-orange-500 font-bold">32</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Opportunities won</span>
                        <span className="text-green-500 font-bold">26</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Current opportunities</span>
                        <span className="text-blue-500 font-bold">6</span>
                    </div>
                </div>
                <button className="mt-6 w-full bg-blue-500 text-white py-2 rounded">
                    View Public Profile
                </button>
            </div>

            {/* Right Container */}
            <div className="w-3/4 ml-6">
                <TabView>
                    <TabPanel header="Account Settings">
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-medium">First Name</label>
                                    <input
                                        type="text"
                                        value="Nathaniel"
                                        className="w-full mt-2 p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium">Last Name</label>
                                    <input
                                        type="text"
                                        value="Poole"
                                        className="w-full mt-2 p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium">Phone Number</label>
                                    <input
                                        type="text"
                                        value="+1800-000"
                                        className="w-full mt-2 p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium">Email address</label>
                                    <input
                                        type="text"
                                        value="nathaniel.poole@microsoft.com"
                                        className="w-full mt-2 p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium">City</label>
                                    <input
                                        type="text"
                                        value="Bridgeport"
                                        className="w-full mt-2 p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium">State/County</label>
                                    <input
                                        type="text"
                                        value="WA"
                                        className="w-full mt-2 p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium">Postcode</label>
                                    <input
                                        type="text"
                                        value="31005"
                                        className="w-full mt-2 p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium">Country</label>
                                    <input
                                        type="text"
                                        value="United States"
                                        className="w-full mt-2 p-2 border rounded-lg"
                                    />
                                </div>
                            </div>
                            <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg">
                                Update
                            </button>
                        </div>
                    </TabPanel>

                    {/* New TabPanel for Changing Password */}
                    <TabPanel header="Alterar Senha">
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block font-medium">Senha Atual</label>
                                    <input
                                        type="password"
                                        placeholder="Digite a senha atual"
                                        className="w-full mt-2 p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium">Nova Senha</label>
                                    <input
                                        type="password"
                                        placeholder="Digite a nova senha"
                                        className="w-full mt-2 p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium">Confirmar Nova Senha</label>
                                    <input
                                        type="password"
                                        placeholder="Confirme a nova senha"
                                        className="w-full mt-2 p-2 border rounded-lg"
                                    />
                                </div>
                            </div>
                            <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg">
                                Salvar
                            </button>
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </div>
    );
};

export default UserProfile;
