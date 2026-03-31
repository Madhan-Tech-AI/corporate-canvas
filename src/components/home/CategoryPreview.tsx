import { Link } from 'react-router-dom';
import Reveal from '@/components/Reveal';

const categories = [
    {
        id: 1,
        name: 'Abstract',
        image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=800&q=80',
        slug: 'abstract'
    },
    {
        id: 2,
        name: 'Portraits',
        image: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?auto=format&fit=crop&w=800&q=80',
        slug: 'portraits'
    },
    {
        id: 3,
        name: 'Landscape',
        image: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=800&q=80',
        slug: 'landscape'
    },
    {
        id: 4,
        name: 'Photography',
        image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80',
        slug: 'photography'
    },
    {
        id: 5,
        name: 'Digital Art',
        image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
        slug: 'digital-art'
    }
];

export default function CategoryPreview() {
    return (
        <section className="section-padding bg-white">
            <div className="container-premium">
                <Reveal width="100%">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <p className="text-caption text-copper mb-2">Curated Collections</p>
                            <h2 className="text-headline text-charcoal">Shop By Category</h2>
                        </div>
                        <Link to="/art-discovery" className="btn-secondary hidden sm:inline-flex">
                            View All Categories
                        </Link>
                    </div>
                </Reveal>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8">
                    {categories.map((category, index) => (
                        <Reveal key={category.id} width="100%" delay={index * 0.1}>
                            <Link to={`/collections?category=${category.slug}`} className="group relative block aspect-square sm:aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-2xl">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                                <div className="absolute bottom-6 left-6">
                                    <h3 className="text-xl font-medium text-white group-hover:translate-x-2 transition-transform duration-300">
                                        {category.name}
                                    </h3>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link to="/art-discovery" className="btn-secondary">
                        View All Categories
                    </Link>
                </div>
            </div>
        </section>
    );
}
