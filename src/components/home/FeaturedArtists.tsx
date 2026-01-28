import { Link } from 'react-router-dom';
import Reveal from '@/components/Reveal';

const artists = [
    {
        id: 1,
        name: 'Eleanor Vance',
        role: 'Abstract Expressionist',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 2,
        name: 'Julian Thorne',
        role: 'Sculptor',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 3,
        name: 'Amara Singh',
        role: 'Digital Artist',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 4,
        name: 'Marcus Reed',
        role: 'Photographer',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    }
];

export default function FeaturedArtists() {
    return (
        <section className="section-padding bg-warm-white/50">
            <div className="container-premium">
                <div className="text-center mb-16">
                    <Reveal width="100%">
                        <p className="text-caption text-copper mb-3">Creative Minds</p>
                        <h2 className="text-headline text-charcoal">Meet the Artists</h2>
                    </Reveal>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {artists.map((artist, index) => (
                        <Reveal key={artist.id} width="100%" delay={index * 0.1}>
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-2 border-transparent group-hover:border-copper/30 transition-colors duration-300">
                                    <img
                                        src={artist.image}
                                        alt={artist.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <h3 className="text-xl font-medium text-charcoal mb-1">{artist.name}</h3>
                                <p className="text-sm text-copper mb-4">{artist.role}</p>
                                <Link to="/about" className="text-sm text-charcoal/60 hover:text-charcoal underline underline-offset-4 decoration-copper/30 hover:decoration-copper transition-all">
                                    View Profile
                                </Link>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
