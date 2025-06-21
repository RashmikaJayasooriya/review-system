'use client';

import {useEffect} from "react";

export default function Home() {

    //call this to test the database connection
    useEffect(
        () => {
            const testDatabaseConnection = async () => {
                try {
                    const response = await fetch('/api/db-test');
                    if (!response.ok) {
                        throw new Error('Database connection failed');
                    }
                    const data = await response.json();
                    console.log(data.status);
                } catch (error) {
                    console.error('Error connecting to the database:', error);
                }
            };

            testDatabaseConnection();
        },
        []
    )

    return (
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-4xl font-bold text-gray-800">Welcome to the System</h1>
        </div>
    );
}