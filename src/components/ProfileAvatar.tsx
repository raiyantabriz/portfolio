// src/components/ProfileAvatar.tsx
import Image from 'next/image';

export default function ProfileAvatar() {
    return (
        <div className="flex flex-col items-center">
            {/* রাউন্ড/ওভাল প্রোফাইল ইমেজ */}
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary shadow-xl">
                <Image
                    src="/images/profile.jpg"  // আপনার ইমেজ
                    alt="আপনার নাম"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            <h1 className="mt-6 text-3xl font-bold">আপনার নাম</h1>
            <p className="text-gray-600 mt-2">Frontend Developer | React Expert</p>
        </div>
    );
}