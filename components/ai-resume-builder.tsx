"use client"

/// <reference path="../types/file-saver.d.ts" />

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2, Download } from "lucide-react"
import { Document, Packer, Paragraph, TextRun } from "docx"
import { saveAs } from "file-saver"

export function AiResumeBuilder() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [summary, setSummary] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [experiences, setExperiences] = useState<{ title: string; company: string; description: string }[]>([])

  const addSkill = () => {
    if (newSkill.trim() !== "") {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const addExperience = () => {
    setExperiences([...experiences, { title: "", company: "", description: "" }])
  }

  const updateExperience = (index: number, field: string, value: string) => {
    const updatedExperiences = [...experiences]
    updatedExperiences[index] = { ...updatedExperiences[index], [field]: value }
    setExperiences(updatedExperiences)
  }

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index))
  }

  const generateAIDescription = (index: number) => {
    const aiDescriptions = [
      "Led cross-functional teams to deliver high-impact projects on time and within budget.",
      "Developed and implemented innovative strategies resulting in a 30% increase in productivity.",
      "Collaborated with stakeholders to optimize processes and drive continuous improvement initiatives.",
    ]
    const randomDescription = aiDescriptions[Math.floor(Math.random() * aiDescriptions.length)]
    updateExperience(index, "description", randomDescription)
  }

  const downloadResume = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: name, bold: true, size: 28 })],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: email, size: 24 }),
                new TextRun({ text: " | ", size: 24 }),
                new TextRun({ text: phone, size: 24 }),
              ],
            }),
            new Paragraph({
              children: [new TextRun({ text: "Professional Summary", bold: true, size: 24 })],
            }),
            new Paragraph({
              children: [new TextRun({ text: summary, size: 24 })],
            }),
            new Paragraph({
              children: [new TextRun({ text: "Skills", bold: true, size: 24 })],
            }),
            new Paragraph({
              children: [new TextRun({ text: skills.join(", "), size: 24 })],
            }),
            new Paragraph({
              children: [new TextRun({ text: "Work Experience", bold: true, size: 24 })],
            }),
            ...experiences.flatMap((exp) => [
              new Paragraph({
                children: [new TextRun({ text: exp.title, bold: true, size: 24 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: exp.company, size: 24 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: exp.description, size: 24 })],
              }),
            ]),
          ],
        },
      ],
    })

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "resume.docx")
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="backdrop-blur-lg bg-white bg-opacity-10 rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-10">
            <h1 className="text-4xl font-bold mb-6 text-center text-white">AI-Powered Resume Builder</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-white">Personal Information</h2>
                  <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="mb-2 bg-white bg-opacity-20 text-white placeholder-gray-300" />
                  <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-2 bg-white bg-opacity-20 text-white placeholder-gray-300" />
                  <Input placeholder="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mb-2 bg-white bg-opacity-20 text-white placeholder-gray-300" />
                  <Textarea
                    placeholder="Professional Summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="mb-2 bg-white bg-opacity-20 text-white placeholder-gray-300"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-white">Skills</h2>
                  <div className="flex mb-2">
                    <Input
                      placeholder="Add a skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="mr-2 bg-white bg-opacity-20 text-white placeholder-gray-300"
                    />
                    <Button onClick={addSkill} className="bg-white text-purple-600 hover:bg-gray-200">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <div key={index} className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full flex items-center">
                        {skill}
                        <button onClick={() => removeSkill(index)} className="ml-2 text-white">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-white">Work Experience</h2>
                  {experiences.map((exp, index) => (
                    <div key={index} className="mb-4 p-4 border border-white border-opacity-20 rounded">
                      <Input
                        placeholder="Job Title"
                        value={exp.title}
                        onChange={(e) => updateExperience(index, "title", e.target.value)}
                        className="mb-2 bg-white bg-opacity-20 text-white placeholder-gray-300"
                      />
                      <Input
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, "company", e.target.value)}
                        className="mb-2 bg-white bg-opacity-20 text-white placeholder-gray-300"
                      />
                      <Textarea
                        placeholder="Job Description"
                        value={exp.description}
                        onChange={(e) => updateExperience(index, "description", e.target.value)}
                        className="mb-2 bg-white bg-opacity-20 text-white placeholder-gray-300"
                      />
                      <div className="flex justify-between">
                        <Button onClick={() => generateAIDescription(index)} variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600">
                          Generate AI Description
                        </Button>
                        <Button onClick={() => removeExperience(index)} variant="destructive" className="bg-red-500 hover:bg-red-600">
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button onClick={addExperience} className="w-full bg-white text-purple-600 hover:bg-gray-200">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
                  </Button>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white bg-opacity-20 p-6 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4 text-white">Resume Preview</h2>
                  <div className="space-y-4 text-white">
                    <div>
                      <h3 className="text-xl font-semibold">{name || "Your Name"}</h3>
                      <p>{email}</p>
                      <p>{phone}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Professional Summary</h4>
                      <p>{summary || "Your professional summary will appear here."}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <span key={index} className="bg-white bg-opacity-20 text-white px-2 py-1 rounded text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Work Experience</h4>
                      {experiences.map((exp, index) => (
                        <div key={index} className="mb-2">
                          <h5 className="font-semibold">{exp.title}</h5>
                          <p className="text-sm">{exp.company}</p>
                          <p className="text-sm">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Button onClick={downloadResume} className="bg-white text-purple-600 hover:bg-gray-200">
                    <Download className="mr-2 h-4 w-4" /> Download as Word
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
