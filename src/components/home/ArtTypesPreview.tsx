import { Link } from 'react-router-dom';
import Reveal from '@/components/Reveal';

const artTypes = [
    {
        id: 'oil',
        name: 'Oil on Canvas',
        description: 'Classic texture and depth',
        color: 'bg-[#F5F1E8]'
    },
    {
        id: 'acrylic',
        name: 'Acrylic',
        description: 'Vibrant and modern',
        color: 'bg-[#EAEFF2]'
    },
    {
        id: 'watercolor',
        name: 'Watercolor',
        description: 'Fluid and expressive',
        color: 'bg-[#F2EAE9]'
    },
    {
        id: 'mixed-media',
        name: 'Mixed Media',
        description: 'layered and complex',
        color: 'bg-[#E8F1F5]'
    },
    {
        id: 'sculpture',
        name: 'Sculpture',
        description: '3D spatial art',
        color: 'bg-[#F5EFE8]'
    }
];

export default function ArtTypesPreview() {
    return (
        <section className="section-padding bg-warm-white/30">
            <div className="container-premium">
                <div className="text-center mb-16">
                    <Reveal width="100%">
                        <p className="text-caption text-copper mb-3">Mediums & Styles</p>
                        <h2 className="text-headline text-charcoal">Explore Art Types</h2>
                    </Reveal>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {artTypes.map((type, index) => (
                        <Reveal key={type.id} width="100%" delay={index * 0.1}>
                            <Link
                                to={`/collections?type=${type.id}`}
                                className={`block p-8 ${type.color} rounded-sm hover:-translate-y-2 transition-transform duration-300 h-full border border-transparent hover:border-copper/10`}
                            >
                                <div className="h-full flex flex-col justify-between min-h-[140px]">
                                    <div>
                                        <h3 className="text-xl font-serif text-charcoal mb-2">{type.name}</h3>
                                        <p className="text-sm text-charcoal/60">{type.description}</p>
                                    </div>
                                    <div className="w-8 h-[1px] bg-copper/40 mt-6" />
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
