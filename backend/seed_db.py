"""
Seed script to populate database with initial data
Run this once to initialize the database with default admin user and mock data
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from auth import get_password_hash
from models import User, Project, BlogPost, AboutContent, ContactInfo, HeroContent, CarouselSlide

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']


async def seed_database():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("🌱 Starting database seeding...")
    
    # 1. Create default admin user
    existing_admin = await db.users.find_one({"username": "admin"})
    if not existing_admin:
        admin_user = User(
            username="admin",
            email="admin@gayrimenkulrehberi.com",
            hashed_password=get_password_hash("admin123"),
            is_active=True
        )
        await db.users.insert_one(admin_user.dict())
        print("✅ Default admin user created (username: admin, password: admin123)")
    else:
        print("⏭️  Admin user already exists")
    
    # 2. Seed About Content
    existing_about = await db.about_content.find_one()
    if not existing_about:
        about_content = AboutContent(
            name="Ahmet Yılmaz",
            title="Gayrimenkul Danışmanı",
            short_bio="15 yıllık deneyimimle, hayalinizdeki mülkü bulmanızda size rehberlik ediyorum. Müşteri memnuniyeti ve profesyonellik ilkelerimle, gayrimenkul yatırımlarınızda güvenilir çözüm ortağınızım.",
            full_bio="2008 yılından beri gayrimenkul sektöründe aktif olarak çalışmaktayım. Bu süre zarfında yüzlerce aileye ev sahibi olma hayallerini gerçekleştirmede yardımcı oldum. Emlak danışmanlığında uzmanlaşmış, piyasa analizleri ve yatırım danışmanlığı konularında sertifikalı bir profesyonelim.\n\nMüşterilerime sadece bir mülk satmıyorum; onların yaşam tarzlarına, bütçelerine ve gelecek planlarına uygun en iyi çözümleri sunuyorum. Dürüstlük, şeffaflık ve müşteri memnuniyeti çalışma prensiplerimin temelini oluşturur.\n\nGayrimenkul sektöründeki geniş network'üm sayesinde, piyasadaki en iyi fırsatları sizin için buluyorum. İster satış, ister kiralama, ister yatırım danışmanlığı olsun, her aşamada yanınızdayım.",
            experience="15+ Yıl",
            completed_projects="200+",
            happy_clients="500+",
            image="https://images.pexels.com/photos/5593720/pexels-photo-5593720.jpeg"
        )
        await db.about_content.insert_one(about_content.dict())
        print("✅ About content seeded")
    else:
        print("⏭️  About content already exists")
    
    # 3. Seed Contact Info
    existing_contact = await db.contact_info.find_one()
    if not existing_contact:
        contact_info = ContactInfo(
            phone="+90 532 123 45 67",
            email="info@gayrimenkulrehberi.com",
            address="Atatürk Bulvarı No:123, Çankaya, Ankara",
            working_hours="Pazartesi - Cumartesi: 09:00 - 18:00",
            facebook="https://facebook.com",
            instagram="https://instagram.com",
            linkedin="https://linkedin.com",
            twitter="https://twitter.com"
        )
        await db.contact_info.insert_one(contact_info.dict())
        print("✅ Contact info seeded")
    else:
        print("⏭️  Contact info already exists")
    
    # 4. Seed Hero Content
    existing_hero = await db.hero_content.find_one()
    if not existing_hero:
        hero_content = HeroContent(
            title="Hayalinizdeki Ev",
            subtitle="Bir Tık Uzağınızda",
            description="15 yıllık deneyimimle, hayalinizdeki mülkü bulmanızda size rehberlik ediyorum. Müşteri memnuniyeti ve profesyonellik ilkelerimle, gayrimenkul yatırımlarınızda güvenilir çözüm ortağınızım.",
            image="https://images.unsplash.com/photo-1613977257365-aaae5a9817ff",
            cta_primary_text="Projeleri İncele",
            cta_secondary_text="İletişime Geç"
        )
        await db.hero_content.insert_one(hero_content.dict())
        print("✅ Hero content seeded")
    else:
        print("⏭️  Hero content already exists")
    
    # 5. Seed Projects (only if empty)
    project_count = await db.projects.count_documents({})
    if project_count == 0:
        projects_data = [
            {
                "title": "Lüks Seaside Residence",
                "location": "Antalya, Lara",
                "type": "Rezidans",
                "status": "completed",
                "image": "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
                "description": "Deniz manzaralı, 2+1 ve 3+1 daire seçenekleriyle lüks yaşam alanı. Kapalı havuz, spor salonu ve sosyal tesisler.",
                "price": "₺5.500.000 - ₺8.200.000",
                "features": ["Deniz Manzarası", "Kapalı Havuz", "Spor Salonu", "7/24 Güvenlik"],
                "completion_date": "2023"
            },
            {
                "title": "Modern City Apartments",
                "location": "İstanbul, Kadıköy",
                "type": "Apartman",
                "status": "completed",
                "image": "https://images.pexels.com/photos/35063303/pexels-photo-35063303.jpeg",
                "description": "Şehir merkezinde, toplu taşımaya yakın, modern yaşam alanları.",
                "price": "₺3.200.000 - ₺6.500.000",
                "features": ["Metro Yakını", "Akıllı Ev Sistemi", "Kapalı Otopark", "Yeşil Alan"],
                "completion_date": "2023"
            },
            {
                "title": "Garden Villa Complex",
                "location": "Muğla, Bodrum",
                "type": "Villa",
                "status": "completed",
                "image": "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4",
                "description": "Bahçeli müstakil villalar. Özel havuz, geniş teraslar.",
                "price": "₺12.000.000 - ₺18.500.000",
                "features": ["Özel Havuz", "Bahçe", "Deniz Manzarası", "4+1 Villa"],
                "completion_date": "2022"
            },
            {
                "title": "Business Plaza Tower",
                "location": "İstanbul, Maslak",
                "type": "Ticari",
                "status": "ongoing",
                "image": "https://images.pexels.com/photos/34840277/pexels-photo-34840277.jpeg",
                "description": "A+ ofis alanları, modern iş merkezi.",
                "price": "₺15.000.000 - ₺45.000.000",
                "features": ["A+ Ofis", "Otopark", "Jeneratör", "Güvenlik"],
                "completion_date": "2025"
            }
        ]
        
        for proj_data in projects_data:
            project = Project(**proj_data)
            await db.projects.insert_one(project.dict())
        
        print(f"✅ {len(projects_data)} projects seeded")
    else:
        print(f"⏭️  {project_count} projects already exist")
    
    # 6. Seed Blog Posts (only if empty)
    blog_count = await db.blog_posts.count_documents({})
    if blog_count == 0:
        blog_posts_data = [
            {
                "title": "2024 Gayrimenkul Piyasası Trendleri",
                "excerpt": "Türkiye'de gayrimenkul sektöründe 2024 yılında yaşanan değişimler ve gelecek öngörüleri...",
                "content": "Detaylı blog içeriği buraya gelecek...",
                "date": "15 Aralık 2024",
                "category": "Piyasa Analizi",
                "image": "https://images.unsplash.com/photo-1615406020658-6c4b805f1f30",
                "author": "Ahmet Yılmaz",
                "read_time": "5 dk okuma"
            },
            {
                "title": "Doğru Ev Nasıl Seçilir? 10 Altın Kural",
                "excerpt": "Ev alırken dikkat etmeniz gereken kritik noktalar...",
                "content": "Detaylı blog içeriği buraya gelecek...",
                "date": "10 Aralık 2024",
                "category": "Satın Alma Rehberi",
                "image": "https://images.pexels.com/photos/18435276/pexels-photo-18435276.jpeg",
                "author": "Ahmet Yılmaz",
                "read_time": "7 dk okuma"
            }
        ]
        
        for post_data in blog_posts_data:
            blog_post = BlogPost(**post_data)
            await db.blog_posts.insert_one(blog_post.dict())
        
        print(f"✅ {len(blog_posts_data)} blog posts seeded")
    else:
        print(f"⏭️  {blog_count} blog posts already exist")
    
    # 7. Seed Carousel Slides (only if empty)
    carousel_count = await db.carousel_slides.count_documents({})
    if carousel_count == 0:
        carousel_slides = [
            CarouselSlide(
                title="Hayalinizdeki Ev",
                subtitle="Bir Tık Uzağınızda",
                description="15 yıllık deneyimimle size rehberlik ediyorum",
                image="https://images.unsplash.com/photo-1613977257365-aaae5a9817ff",
                cta_text="Projeleri İncele",
                cta_link="/projeler",
                order=1,
                is_active=True
            ),
            CarouselSlide(
                title="Lüks Yaşam Alanları",
                subtitle="Modern Mimari",
                description="Deniz manzaralı ve şehir merkezinde prestijli projeler",
                image="https://images.unsplash.com/photo-1613490493576-7fde63acd811",
                cta_text="Detayları Gör",
                cta_link="/projeler",
                order=2,
                is_active=True
            ),
            CarouselSlide(
                title="Güvenilir Danışmanlık",
                subtitle="Profesyonel Hizmet",
                description="200+ tamamlanmış proje, 500+ mutlu müşteri",
                image="https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4",
                cta_text="İletişime Geç",
                cta_link="/iletisim",
                order=3,
                is_active=True
            )
        ]
        
        for slide in carousel_slides:
            await db.carousel_slides.insert_one(slide.dict())
        
        print(f"✅ {len(carousel_slides)} carousel slides seeded")
    else:
        print(f"⏭️  {carousel_count} carousel slides already exist")
    
    print("\n🎉 Database seeding completed!")
    print("\n📝 Default Admin Credentials:")
    print("   Username: admin")
    print("   Password: admin123")
    print("   ⚠️  Please change these credentials after first login!\n")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
