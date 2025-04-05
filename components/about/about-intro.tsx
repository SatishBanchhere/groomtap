import Image from "next/image"

export default function AboutIntro() {

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-[#ff8a3c] font-medium">ABOUT DOCPRO</span>
            <h2 className="text-3xl md:text-4xl font-bold">Bring care to your home with one click</h2>
            <p className="text-gray-600">
              DocZappoint Pvt. Ltd., registered in January 2024, is at the forefront of healthcare innovation. Launched
              on July 10th, 2024, we revolutionize healthcare by offering seamless online doctor appointments through
              our advanced telemedicine platform, connecting patients with licensed professionals remotely. Our
              innovative approach ensures healthcare is more accessible, convenient, and patient-centric.
            </p>
          </div>
          <div className="relative">
            <div className="w-full aspect-video rounded-lg overflow-hidden">
              <Image
                src="https://i.ibb.co/xqQkL9KZ/image.png"
                alt="Healthcare services"
                width={500}
                height={500}
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
