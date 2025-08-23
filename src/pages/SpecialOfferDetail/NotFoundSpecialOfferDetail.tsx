import HeroSection from '@/components/common/HeroSection'
import { Button } from '@/components/ui/button'
import { HERO_CONTENT } from '@/constants/heroSections'
import Footer from '@/Layout/footer/Footer'
import Navigation from '@/Layout/Navigation'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFoundSpecialOfferDetail: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navigation />

                {/* Hero Section */}
                <HeroSection
                    image={`SPECIAL_OFFER`}
                    span={HERO_CONTENT.SPECIAL_OFFER.span}
                    title={HERO_CONTENT.SPECIAL_OFFER.title}
                    description={HERO_CONTENT.SPECIAL_OFFER.description}
                />

                <section className="max-w-7xl mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Offer not found
                        </h1>
                        <Button onClick={() => navigate('/menu')}>
                            Return to Menu
                        </Button>
                    </div>
                </section>
                <Footer />
            </div>
        </>
    )
}

export default NotFoundSpecialOfferDetail