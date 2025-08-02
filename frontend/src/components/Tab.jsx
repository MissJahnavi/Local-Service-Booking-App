import React, { useState } from 'react';

export const Tabs = ({ children, defaultValue }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);

    return (
        <div>
            <div className="flex space-x-4 mb-4 border-b pb-2">
                {React.Children.map(children, (child) =>
                    React.cloneElement(child, {
                        isActive: child.props.value === activeTab,
                        onClick: () => setActiveTab(child.props.value),
                    })
                )}
            </div>
            <div className="mt-4">
                {React.Children.map(children, (child) =>
                    child.props.value === activeTab ? child.props.children : null
                )}
            </div>
        </div>
    );
};

export const Tab = ({ label, isActive, onClick }) => {
    return (
        <button
            className={`px-4 py-2 rounded-t text-sm font-medium ${isActive ? 'bg-white border-b-2 border-black' : 'text-gray-500'
                }`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};
