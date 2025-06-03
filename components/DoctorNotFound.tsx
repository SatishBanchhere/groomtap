import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component
import Image from 'next/image';

export default function DoctorNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f5ef] p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                <div className="mx-auto w-48 h-48 relative mb-6">
                    <Image
                        src="/doctorNotFound.png" // You should add this SVG to your public folder
                        alt="Doctor not found"
                        fill
                        className="object-contain"
                    />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Doctor Not Found</h1>
                <p className="text-gray-600 mb-6">
                    We couldn't find the doctor you're looking for. Please check the URL or browse our list of available doctors.
                </p>
                <Link href="/doctors" passHref>
                    <Button className="bg-[#ff8a3c] hover:bg-[#ff7a2c] text-white">
                        Browse Doctors
                    </Button>
                </Link>
            </div>
        </div>
    );
}
