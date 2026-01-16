'use client';

import { useState } from 'react';
import ImageModal from '@/components/ImageModal';
import ProjectCard from '@/components/ProjectCard';
import Navigation from '@/components/Navigation';
import ScrollToTop from '@/components/ScrollToTop';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Mail,
  Github,
  Linkedin,
  Send,
  Send as Telegram,
  Code2,
  Shield,
  Globe,
  Terminal,
  Lock,
  Eye,
  Phone,
  FileText,
  Award,
  ExternalLink,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function Portfolio() {
  const [selectedImage, setSelectedImage] = useState<{ url: string; title?: string } | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageClick = (url: string, title?: string) => {
    setSelectedImage({ url, title });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/messages', {  // ← ঠিক এই পাথ
        method: 'POST',  // ← POST method
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Failed to send message.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Certificate data
  const certificates = [
    {
      id: 1,
      title: 'Cyber Security Professional',
      imageUrl: '/portfolio-images/cybersecurity-for-professionals.png',
    },
    {
      id: 2,
      title: 'Cyber Security Fundemantals',
      imageUrl: '/portfolio-images/cybersecurityfundemantals.png',
    },
    {
      id: 3,
      title: 'Ethical hacking for Professionals',
      imageUrl: '/portfolio-images/Ethical-hacking-for-Professionals.png',
    },
    {
      id: 4,
      title: 'computer forensic and digital forensics ',
      imageUrl: '/portfolio-images/computer-forensic-and-digital-forensics .jpg',
    },
    {
      id: 5,
      title: 'network security',
      imageUrl: '/portfolio-images/network security.png',
    },
    {
      id: 6,
      title: 'cryptography ',
      imageUrl: '/portfolio-images/cryptography.png',
    },
  ];

  // Web Development Projects
  const webProjects = [
    {
      title: 'Bakery E-Commerce Platform',
      description: 'A full-featured e-commerce platform with modern UI, payment integration, and inventory management.',
      imageUrl: 'portfolio-images/bakeout.png',
      tags: ['HTML', 'css', 'JavaScript'],
    },
    {
      title: 'Travel Booking Application',
      description: 'A modern travel booking application where users can search destinations, explore tour packages, and make bookings through an intuitive and responsive interface. Designed for performance, usability, and scalability using modern web technologies.',
      imageUrl: 'portfolio-images/travel.png',
      tags: ['Html', 'Css', 'JavaScript' , 'PHP'],
    },
    {
      title: 'Accessory e-Commerce Site',
      description: 'A full-featured electric accessory e-commerce website designed to sell electronic and electrical products such as chargers, cables, adapters, lighting accessories, and gadgets. The platform includes product filtering, cart management, secure checkout, and responsive design for all devices.',
      imageUrl: 'portfolio-images/ecommerce.png',
      tags: ['HTML', 'Css', 'Javascript', 'PHP'],
    },
    {
      title: 'student id card maker website',
      description: 'A web-based Student ID Card Maker that allows users to create, preview, and download customized student ID cards by entering student information and uploading photos.',
      imageUrl: 'portfolio-images/student id card maker.png',
      tags: ['Next.js', 'Tailwind CSS', 'JavaScript'],
    },
  ];

  // OSINT Work Showcase
  const osintWork = [
    {
      title: 'Phone Number Investigation',
      description: 'Comprehensive phone number OSINT investigation revealing carrier, location, and owner information.',
      imageUrl: 'portfolio-images/maxresdefault.jpg',
      tags: ['OSINT', 'Phone Lookup', 'Analysis'],
    },
    {
      title: 'Image Forensics Analysis',
      description: 'Advanced image metadata extraction and analysis for digital investigation purposes.',
      imageUrl: 'portfolio-images/osint-work-2.png',
      tags: ['Forensics', 'Metadata', 'Analysis'],
    },
    {
      title: 'Digital Footprint Research',
      description: 'Complete digital footprint mapping showing online presence and connections across platforms.',
      imageUrl: 'portfolio-images/Digital-Footprint-Examples.jpg',
      tags: ['OSINT', 'Research', 'Mapping'],
    },
    {
      title: 'Social Media Investigation',
      description: 'Professional social media investigation with timeline analysis and profile correlation.',
      imageUrl: 'portfolio-images/a33e955e005e1f8c85b61519b4de3074.png',
      tags: ['OSINT', 'Social Media', 'Analysis'],
    },
  ];

  // Cyber Security Tools
  const securityTools = [
    {
      title: 'Computer Security Scanner',
      description: 'Automated computer security scanning tool for vulnerability detection and security assessment.',
      imageUrl: 'portfolio-images/securitytool.png',
      tags: ['Security', 'Scanning', 'Network'],
    },
    {
      title: 'Website verification Tool',
      description: 'A Website Verification Tool that analyzes SSL status, domain and DNS information, server response, and basic site metadata to verify the authenticity and security of a website.',
      imageUrl: 'portfolio-images/websiteverifier.png',
      tags: ['SSL', 'DNS', 'Analysis'],
    },
    {
      title: 'Windows Activation Tool',
      description: 'A reliable Windows Activation Tool for managing and activating Windows operating systems efficiently.',
      imageUrl: 'portfolio-images/winactive.png',
      tags: ['Security', 'Vulnerability', 'Assessment'],
    },
    {
      title: 'Threat Intelligence Dashboard',
      description: 'Real-time threat intelligence monitoring and alerting system for security professionals.',
      imageUrl: 'portfolio-images/coming-soon-text-animation-on-black-background-free-video.jpg',
      tags: ['Security', 'Threat Intel', 'Monitoring'],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            {/* Profile Image */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="flex items-center justify-center my-12">
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary shadow-xl">
                  <img 
                    src="\images\profile.jpg" 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-2 mb-6">
              <Code2 className="h-8 w-8 text-primary" />
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000">
              [K M E RAIYEEAN TABRIZ]
            </h1>
            
            <p className="text-lg md:text-xl text-primary font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
              Frontend Web Developer & Open Source Intelligence (OSINT) Expert
            </p>
          </div>

          <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-600">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ArrowDown className="mr-2 h-4 w-4" />
              Learn More
            </Button>
          </div>

          {/* Tech Stack Icons */}
          <div className="flex flex-wrap justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-800">
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-accent">React</Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-accent">Next.js</Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-accent">TypeScript</Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-accent">Tailwind CSS</Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-accent">OSINT</Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-accent">Security</Badge>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">About Me</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Passionate developer and security researcher focused on building modern web applications
              and conducting ethical OSINT investigations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card border-border">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Code2 className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-semibold text-foreground">Frontend Development</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Specializing in modern frontend technologies including React, Next.js, and TypeScript.
                  I create responsive, accessible, and performant web applications with clean code
                  and elegant user interfaces.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1 w-1 bg-primary rounded-full" />
                    Component-based architecture
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1 w-1 bg-primary rounded-full" />
                    Responsive design principles
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1 w-1 bg-primary rounded-full" />
                    Performance optimization
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-semibold text-foreground">OSINT Expert</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Experienced in Open Source Intelligence techniques for ethical investigations,
                  digital footprint analysis, and cyber security research. I help organizations
                  identify potential security risks through intelligent information gathering.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1 w-1 bg-primary rounded-full" />
                    Ethical investigations
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1 w-1 bg-primary rounded-full" />
                    Digital forensics
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1 w-1 bg-primary rounded-full" />
                    Threat intelligence
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Certificates Section */}
      <section id="certificates" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Award className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Certificates</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Professional certifications and qualifications in web development and cyber security.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificates.map((cert) => (
              <Card
                key={cert.id}
                className="group overflow-hidden bg-card border-border cursor-pointer hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                onClick={() => handleImageClick(cert.imageUrl, cert.title)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={cert.imageUrl}
                    alt={cert.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-center">
                    {cert.title}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Projects Section - Web Development */}
      <section id="web-dev" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Code2 className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Web Development Projects</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Modern web applications built with cutting-edge technologies and best practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {webProjects.map((project, index) => (
              <ProjectCard
                key={index}
                {...project}
                onImageClick={() => handleImageClick(project.imageUrl, project.title)}
              />
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* OSINT Work Showcase */}
      <section id="osint" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Eye className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">OSINT Work Showcase</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Professional OSINT investigations and analysis projects demonstrating expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {osintWork.map((work, index) => (
              <ProjectCard
                key={index}
                {...work}
                onImageClick={() => handleImageClick(work.imageUrl, work.title)}
              />
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Cyber Security Tools */}
      <section id="tools" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Lock className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Cyber Security Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Custom-built security tools for vulnerability assessment, monitoring, and protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityTools.map((tool, index) => (
              <ProjectCard
                key={index}
                {...tool}
                onImageClick={() => handleImageClick(tool.imageUrl, tool.title)}
              />
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Telegram Channel Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
            <CardContent className="p-12 text-center space-y-6">
              <Telegram className="h-16 w-16 text-primary mx-auto" />
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">Stay Connected</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Join my Telegram channel to stay updated with the latest projects, tutorials,
                  security tips, and industry insights. Get exclusive content and connect with
                  a community of developers and security enthusiasts.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-lg px-8"
                  onClick={() => window.open('https://t.me/securedhub', '_blank')}
                >
                  <Telegram className="mr-2 h-5 w-5" />
                  Join My Telegram Channel
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                join my telegram channel for more update
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Mail className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Get In Touch</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Have a project in mind or want to collaborate? Feel free to reach out.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                {/* Success Message */}
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        Message sent successfully! I'll get back to you soon.
                      </span>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        {errorMessage}
                      </span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                      Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-background border-input"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-background border-input"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell me about your project..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-background border-input min-h-32"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Social Links */}
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">Connect With Me</h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start hover:border-primary hover:text-primary transition-all"
                      onClick={() => window.open('https://github.com/raiyantabriz', '_blank')}
                    >
                      <Github className="mr-3 h-5 w-5" />
                      GitHub
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start hover:border-primary hover:text-primary transition-all"
                      onClick={() => window.open('https://linkedin.com/in/raiyan-tabriz-37379a265', '_blank')}
                    >
                      <Linkedin className="mr-3 h-5 w-5" />
                      LinkedIn
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start hover:border-black hover:text-black dark:hover:border-white dark:hover:text-white transition-all"
                      onClick={() => window.open('https://x.com/RaiyanTabriz')}
                    >
                      <svg 
                        className="mr-3 h-5 w-5" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      X
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start hover:border-primary hover:text-primary transition-all"
                      onClick={() => window.open('https://t.me/YOUR_TELEGRAM_USERNAME', '_blank')}
                    >
                      <Telegram className="mr-3 h-5 w-5" />
                      Telegram
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">Quick Info</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-primary" />
                      <span>Based: Mirpur1, Dhaka-1216</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>Available: Remote / Hybrid</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Terminal className="h-4 w-4 text-primary" />
                      <span>Open to: Projects & Consultations</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} [Raiyeean]. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </footer>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.url}
          title={selectedImage.title}
        />
      )}

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
